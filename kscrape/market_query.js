
import { RepeatQuery, Query } from "./query.js";
import { insert_market_queries, insert_order_observations, insert_orders } from "./db.js";
import { has_changed } from "./observation_cache.js";
import { client } from "./api.js";

export class MarketRegionQuery extends Query {
    constructor( region_id ) { 
        super()
        this.region_id = region_id
    }

    fetch_page ( page ) { 
        this.pages[page] = new MarketPageQuery(this.region_id, page, this.pages_callback.bind(this) )
        .run()
        .catch( error => {
            console.error( "MarketRegionQuery fetch_page:", error )
            this.pages.set(page, undefined)
        }) 
    }

    async pages_callback ( num_pages ) {
        [...Array(num_pages - 1).keys()]
        .forEach( async page => {
        if ( !this.pages.has(page + 1 ) ) {
            this.fetch_page(page + 1)
        }})
    }

    async fetch ( ) { 
        this.pages = new Map
        
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

        const changed_orders = fetch_return.orders.filter( has_changed( response.headers['last-modified']) )

        if (changed_orders.length === 0) return

        await insert_orders(changed_orders)

        const insert_response = await insert_market_queries([fetch_return.query])

        console.log(`region:page ${ this.region_id }:${ this.page }:${ changed_orders.length / order_records.length }%`)

        return insert_order_observations( changed_orders, insert_response[0].id )
    }
}