const SwaggerClient = require('swagger-client');

let OAS_uri = "https://esi.evetech.net/latest/swagger.json?datasource=tranquility";

let client = SwaggerClient(OAS_uri)

exports.load_client = async () => {
    await client
}

exports.region_ids = async () => {
    const response = ( await client ).apis.Universe.get_universe_regions()
    return response.then( r => r.obj )
}

exports.region_info = async (region) =>  {
    const response = ( await client ).apis.Universe.get_universe_regions_region_id({ region_id: region })
    return response.then( r => r.obj )
}

exports.constellations_ids = async () => {
    const response = ( await client ).apis.Universe.get_universe_constellations()
    return response.then( r => r.obj )
}

exports.constellations_info = async (constellation) => {
    const response = (await client).apis.Universe.get_universe_constellations_constellation_id({ constellation_id: constellation })
    return response.then( r => r.obj )
}

exports.location_ids = async () => {
    return (await client).apis.Universe.get_universe_structures()
}

exports.orders = async (region) =>  {
    return (await client).apis.Market.get_markets_region_id_orders({ region_id: region })
}

exports.all_orders = async (region) => {
    let pages = [(await client).apis.Market.get_markets_region_id_orders({ region_id: region })]

    let num_pages = (await pages[0]).headers["x-pages"]

    for (let i = 2; i < num_pages; i++) { 
        pages.push((await client).apis.Market.get_markets_region_id_orders({ region_id: region, page: i }))
    }
    
    return pages
}

      