
import { RepeatQuery, Query, client } from "./query.js";
import { sql } from "./db.js";

export class MarketRegionQuery extends Query {
    constructor( region_id ) { 
        super()
        this.region_id = region_id
    }

    fetch_page ( page ) { 
        this.pages[page] = new MarketPageQuery(this.region_id, page, this.pages_callback.bind(this) )
        .run()
        .catch( error => {
            console.error(error)
            this.pages[page] = undefined
        }) 
    }

    async pages_callback ( num_pages ) {
            [...Array(num_pages - 1).keys()]
            .forEach( async page => {
            if ( this.pages[page + 1] == undefined ) {
                this.fetch_page(page + 1)
            }
        })
    }

    async fetch ( ) { 
        this.pages = new Object
        
        this.fetch_page(1)

        return new Promise(() => {})
    }
}
class OrderObservations {
    constructor( order_id ) {
        this.order_id = order_id
    }

    add( order, observation_time ) {
        const observation_date = new Date(observation_time)

        if ( this.last != undefined 
        && this.last.observation_time > observation_time ) return

        this.last = { order, time: observation_date }
    } 

    async latest( before ) {
        const before_date = new Date(before)
        if ( this.last != undefined && before_date > this.last.time ) {
            return this.last.order
        } else {
            return undefined
            return await sql`
                SELECT * 
                FROM order_observations
                JOIN market_queries
                ON order_observations.query_id = market_queries.id
                WHERE order_observations.order_id = ${ this.order_id }
                AND ${ before_date } > (market_queries.query->>'last-modified')::timestamp
                ORDER BY (market_queries.query->>'last-modified')::timestamp DESC
                LIMIT 1
            `.then( r => {console.log(r); return r[0]} )
        }
    }
}

const order_cache = new Map

var run_vol = 0 

setInterval(() => {
    console.log(run_vol)
    run_vol = 0
}, 1000 * 60 * 5)

class MarketPageQuery extends RepeatQuery {
    constructor( region_id, page, pages_callback ) { 
        super()
        this.region_id = region_id
        this.page = page
        this.pages_callback = pages_callback
    }

    async fetch() { 
        const response = await ( await client ).apis.Market.get_markets_region_id_orders({ region_id: this.region_id, page: this.page }).catch(e => console.log(e))

        //set next run time

        this.query_ready = new Date( new Date(response.headers['expires']).getTime() + 1000);

        this.pages_callback(Number(response.headers['x-pages']))

        return response
    }

    async save( response ) {

        const query_record = { headers: response.headers, region_id: this.region_id, page: this.page }

        const order_records = response.obj

        //console.log( this.region_id, this.page, response.headers['expires'] )

        const has_changed = async ( order ) => {

            const order_id = order['order_id']

            if ( !order_cache.has( order_id ) ) {
                order_cache.set( order_id, new OrderObservations( order_id ))
            }

            const observation_time = Date(response.headers['last-modified'])

            const last_before = await order_cache.get( order_id ).latest( observation_time )

            order_cache.get( order_id ).add( order, observation_time )

            if ( last_before == undefined ) {
                //console.log("New Order")
                return true
            } else if ( last_before['volume_remain'] != order['volume_remain'] ) {
                const volume = Number(order['price']) * (Number(last_before['volume_remain']) - Number(order['volume_remain']))

                run_vol += volume

                return true
            } else if ( last_before['price'] != order['price'] ) {
                //console.log("Price change")
                return true
            } else {
                return false
             }
        }

        const changed_orders = order_records.filter(has_changed)

        if (changed_orders.length === 0) {
            return
        }
        return
        return Promise.all( this.save_orders(changed_orders), this.save_query_run( query_record ))
    }

    async save_orders ( changed_orders ) {
        
    }

    async save_query_run ( query ) {
        return sql`
         INSERT INTO market_queries 
         (type, query)
         values
           (${"get_markets_region_id_orders"}, ${ JSON.stringify(query) })
        ON CONFLICT DO NOTHING`.then(r => console.log(r))
    }
}