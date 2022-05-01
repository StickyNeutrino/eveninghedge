const SwaggerClient = require('swagger-client');

let OAS_uri = "https://esi.evetech.net/latest/swagger.json?datasource=tranquility";

let client = SwaggerClient(OAS_uri)

exports.load_client = async () => {
    await client
}

let make_getter = ( api, function_name, ...param_names ) => {

    const rename = ( params ) => {
        const kv_pairs = param_names.map( name => {name, params.shift()})
        return Object.fromEntries( kv_pairs )
    }

    return async ( ...params ) => {

        const renamed = { ...rename(params),  ...params }
        const response = ( await client ).apis[api][function_name](renamed)
        return response.then( r => r.obj )
    }
}

exports.region_ids = make_getter("Universe", "get_universe_regions")

exports.region_info =  make_getter("Universe", "get_universe_regions_region_id")

exports.constellation_ids = make_getter("Universe", "get_universe_constellations")

exports.constellation_info = make_getter("Universe", "get_universe_constellations_constellation_id", "constellation_id")

exports.location_ids = make_getter("Universe", "get_universe_structures")

exports.locations_info = async ( locations ) => {
    const response = (await client).apis.Universe.post_universe_names({ ids: locations })

    return response.then( r => { 
        return r.obj.map( (location) => {
            return location.type = location.category
        })
    })
}

exports.orders = make_getter("Market", "get_markets_region_id_orders", "region_id")

exports.all_orders = async (region) => {
    let pages = [(await client).apis.Market.get_markets_region_id_orders({ region_id: region })]

    let num_pages = (await pages[0]).headers["x-pages"]

    for (let i = 2; i < num_pages; i++) { 
        pages.push((await client).apis.Market.get_markets_region_id_orders({ region_id: region, page: i }))
    }
    
    return pages
}

      