
import { RepeatQuery, Query } from "./query.js";
import { insert_market_queries, insert_order_observations, insert_orders } from "./db.js";
import { has_changed } from "./observation_cache.js";
import { get_market_region_orders } from "./api.js";
import { range, retry } from "./util.js"

export class MarketRegionQuery extends Query {
    constructor( region_id ) { 
        super()
        this.region_id = region_id
        this.num_pages = 1
        this.pages = new Map
        
    }

    fetch_page ( page ) { 
        const page_query = new MarketPageQuery(this.region_id, page, this.pages_callback.bind(this) )

        this.pages.set( page, 
            page_query
            .run()
            .catch(  ( error ) => {
                console.error( "MarketRegionQuery fetch_page:", error )

                //infinite recursion 
                this.fetch_page ( page ) 
            } ) )
    }

    pages_callback ( num_pages ) {
        if ( this.num_pages === num_pages ) return

        [...range(this.num_pages, num_pages)]
        .filter( page => !this.pages.has( page ) )
        .forEach( page => this.fetch_page( page ) )

        this.num_pages = num_pages
    }

    async fetch ( ) { 
        this.fetch_page( this.num_pages )

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
        const response = await retry( get_market_region_orders( this.region_id, this.page ), 3 )

        this.set_next_run( response.headers['expires'] )

        this.pages_callback( Number(response.headers['x-pages']) )

        return { 
            query: { headers: response.headers, region_id: this.region_id, page: this.page },
            orders: response.obj }
    }

    async save( fetch_return ) {
        const changed_orders = fetch_return.orders.filter( has_changed( fetch_return.query.headers['last-modified']) )

        if (changed_orders.length === 0) return

        await insert_orders(changed_orders)

        const insert_response = await insert_market_queries([fetch_return.query])

        return insert_order_observations( changed_orders, insert_response[0].id )
    }
}