
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

class Query {
    async run() {
        const data = await this.fetch()

        return this.save(data)
    }

    fetch() {

    }

    save(data) {

    }
}

class RepeatQuery extends Query {

    constructor() {
        super()
        this.next_run = Date.now()
    }

    get query_ready() {
        function setToHappen(fn, date){
            const diff = date - Date.now()

            return setTimeout(fn, diff > 0 ? diff : 5 * 1000 );
        }
        return new Promise((resolve) => setToHappen(resolve, this.next_run))
    }

    set query_ready ( date ) {
        this.next_run = date
    }
 
    async run() {
        while (true) {
            console.log("repeat")
            await this.query_ready

            await super.run.bind(this)()
        }
    }
}

export { Query, RepeatQuery }