
const SwaggerClient = require('swagger-client');

let OAS_uri = "https://esi.evetech.net/latest/swagger.json?datasource=tranquility";

let client = SwaggerClient(OAS_uri);

exports.client = client ;

exports.load_client = async () => {
    await client
}

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
            await this.query_ready

            await super.run()
        }
    }
}

exports.RepeatQuery = RepeatQuery