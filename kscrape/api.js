import SwaggerClient from 'swagger-client';
import fetch from 'node-fetch';
import https from 'node:https';
let OAS_uri = "https://esi.evetech.net/latest/swagger.json?datasource=tranquility";

const httpsAgent = new https.Agent({
	keepAlive: true
});

httpsAgent.maxSockets = 16;

const agentFetch = (url) => {
    return fetch(url, {agent:httpsAgent})
}


let client = new SwaggerClient({ url: OAS_uri, userFetch: agentFetch});

export { client } ;

const load_client = async () => {
    await client
}

export { load_client }
