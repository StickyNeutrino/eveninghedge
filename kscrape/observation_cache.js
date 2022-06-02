
class OrderObservationsCache {
    constructor( order_id ) {
        this.order_id = order_id
    }

    add( order, observation_time ) {
        const observation_date = new Date(observation_time)

        if ( this.last != undefined 
        && this.last. time > observation_date ) return

        const small_order = { price: order['price'], volume_remain: order['volume_remain'] }

        this.last = { order:small_order, time: observation_date }
    } 

    async latest( before ) {
        const before_date = new Date(before)
        if ( this.last != undefined && before_date > this.last.time ) {
            return this.last.order
        } else {
            return undefined
        }
    }
}

const order_cache = new Map

export const has_changed = ( observation_time ) => async ( order ) => {

    const order_id = order['order_id']

    if ( !order_cache.has( order_id ) ) {
        order_cache.set( order_id, new OrderObservationsCache( order_id ))
    }

    const last_before = await order_cache.get( order_id ).latest( observation_time )

    order_cache.get( order_id ).add( order, observation_time )

    if ( last_before == undefined
        || last_before['volume_remain'] != order['volume_remain']
        || last_before['price'] != order['price']) {
        return true
    } else {
        return false
    }
}