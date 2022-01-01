const SwaggerClient = require('swagger-client');

let OAS_uri = "https://esi.evetech.net/latest/swagger.json?datasource=tranquility";

let client = SwaggerClient(OAS_uri)

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

      