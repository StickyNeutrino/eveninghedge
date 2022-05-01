
const { RepeatQuery, Query, client } = import("./query.js")

class MarketRegionQuery extends Query {
    constructor( region_id ) { 
        this.region_id = region_id
    }

    fetch_page ( page ) { 
        this.pages[page] = MarketPageQuery(this.region_id, page, this.pages_callback )
        .run()
        .catch( error => {
            console.error(error)
            this.pages[page] = undefined
        }) 
    }

    pages_callback ( num_pages ) {
        [...Array(num_pages).keys()]
        .forEach( page => {
            if ( this.pages[page] == undefined ) {
                this.fetch_page(page)
            }
        })
    }

    async fetch ( ) { 
        this.pages = new Object
        
        this.fetch_page(0)

        return new Promise(() => {})
    }
}

class OrderCache {
    constructor() {
        this.cache = new Object()
    }

    has( key ) {

    }

    get(key) {

    }

    set( key, value ) {

    }
}

class OrderObservations {
    constructor( order_id ){
        this.order_id = order_id
    }

    add( order, observation_time ) {

    } 

    latest( before ) {

    }
}

const order_cache = new OrderCache

class MarketPageQuery extends RepeatQuery {
    constructor( region_id, page, pages_callback ) { 
        this.region_id = region_id
        this.page = page
        this.pages_callback = pages_callback
    }

    async fetch() {
        const response = await ( await client ).apis.Markets.get_markets_region_id_orders({ region_id: this.region_id, page: this.page })

        //set next run time
        this.query_ready = new Date( new Date(response.headers['expires']).getTime() + 1000);

        this.pages_callback(Number(response.headers['x-pages']))

        return response
    }

    async save( response ) {

        const query_record = { headers: response.headers, region_id: this.region_id, page: this.page }

        const order_records = response.obj

        const has_changed = ( order ) => {
            const observation_time = Date(response.headers['last-modified'])

            const last_before = order_cache.get(order['order_id']).last_before( observation_time )

            if ( last_before['price'] == order['price'] 
            && last_before['volume_remain'] == order['volume_remain'] )
            return false
            else return true 
        }

        const changed_orders = order_records.filter(has_changed)

        if (changed_orders.length === 0) {
            return
        }
    }
}