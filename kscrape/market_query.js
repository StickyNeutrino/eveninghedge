
import { RepeatQuery, Query } from "./query.js";
import { insert_market_queries, insert_order_observations, insert_orders } from "./db.js";
import { has_changed } from "./observation_cache.js";
import { client } from "./api.js";
import { range } from "./util.js"

export class MarketRegionQuery extends Query {
    constructor( region_id ) { 
        super()
        this.region_id = region_id
        this.pages = new Map
        
    }

    fetch_page ( page ) { 
        const page_query = new MarketPageQuery(this.region_id, page, this.pages_callback.bind(this) )

        const error_handler = ( error ) => {
            page_query.alive = false

            this.pages.set(page, undefined)

            console.error( "MarketRegionQuery fetch_page:", error )
        }

        const run_promise = page_query
            .run()
            .catch( error_handler )

        this.pages.set( page, run_promise )
    }

    pages_callback ( num_pages ) {
        [...range(1, num_pages)]
        .filter( page => !this.pages.has( page ) )
        .map( page => this.fetch_page( page ) )
    }

    async fetch ( ) { 
        this.fetch_page(1)

        return new Promise(() => {})
    }
}

class MarketPageQuery extends RepeatQuery {
    constructor( region_id, page, pages_callback ) { 
        super()
        this.region_id = region_id
        this.page = page
        this.pages_callback = pages_callback
    }

    async fetch() { 
        try {
            const response = await ( await client ).apis.Market.get_markets_region_id_orders({ region_id: this.region_id, page: this.page })

            this.set_next_run(response.headers['expires'])

            this.pages_callback(Number(response.headers['x-pages']))

            return { 
                query: { headers: response.headers, region_id: this.region_id, page: this.page },
                orders: response.obj }
        } catch (error) {
            console.error("MarketPageQuery fetch:", error)
            
            throw "MarketPageQuery fetch failed"
        }
    
    }

    async save( fetch_return ) {

        const changed_orders = fetch_return.orders.filter( has_changed( fetch_return.query.headers['last-modified']) )

        if (changed_orders.length === 0) return

        await insert_orders(changed_orders)

        const insert_response = await insert_market_queries([fetch_return.query])

        console.log(`region:page ${ this.region_id }:${ this.page }:${ 100 * ( changed_orders.length / fetch_return.orders.length ) }%`)

        return insert_order_observations( changed_orders, insert_response[0].id )
    }
}