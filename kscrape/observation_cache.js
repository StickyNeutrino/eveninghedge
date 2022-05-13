import { sql } from "./db.js";

const order_cache = new Map

class OrderObservationsCache {
    constructor( order_id ) {
        this.order_id = order_id
    }

    add( order, observation_time ) {
        const observation_date = new Date(observation_time)

        if ( this.last != undefined 
        && this.last.observation_time > observation_date ) return

        const small_order = { price: order['price'], volume_remain: order['volume_remain'] }

        this.last = { small_order, time: observation_date }
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


export const has_changed = ( observation_time ) => async ( order ) => {

    const order_id = order['order_id']

    if ( !order_cache.has( order_id ) ) {
        order_cache.set( order_id, new OrderObservationsCache( order_id ))
    }

    const order_observations = order_cache.get( order_id )

    const last_before = await order_observations.latest( observation_time )

    order_cache.get( order_id ).add( order, observation_time )

    if ( last_before == undefined
        || last_before['volume_remain'] != order['volume_remain']
        || last_before['price'] != order['price']) {
        return true
    } else {
        return false
    }
}