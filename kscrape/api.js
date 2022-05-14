import SwaggerClient from 'swagger-client';
import fetch from 'node-fetch';
import https from 'node:https';

let OAS_uri = "https://esi.evetech.net/latest/swagger.json?datasource=tranquility";

const httpsAgent = new https.Agent({
	keepAlive: true
});

httpsAgent.maxSockets = 16;

export const client = new SwaggerClient({ 
    url: OAS_uri,
    userFetch: (url) => fetch(url, { agent: httpsAgent }) 
});

export const load_client = async () => { await client }

