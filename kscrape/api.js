import SwaggerClient from 'swagger-client';
import fetch from 'node-fetch';
import https from 'node:https';

let OAS_uri = "https://esi.evetech.net/latest/swagger.json?datasource=tranquility";

const httpsAgent = new https.Agent({
	keepAlive: true
});

httpsAgent.maxSockets = 1;

export const client = new SwaggerClient({ 
    url: OAS_uri,
    userFetch: (url) => fetch(url, { agent: httpsAgent }) 
});

export const load_client = async () => { await client }

export const get_market_region_orders = async ( region_id, page ) => {
    return ( await client ).apis.Market.get_markets_region_id_orders({ region_id, page })
}