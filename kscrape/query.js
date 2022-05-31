import { date_promise  } from "./util"

export class Query {
    async run() {
        const data = await this.fetch()

        return this.save(data)
    }

    fetch() { }

    save( data ) { return data }
}

export class RepeatQuery extends Query {

    constructor() {
        super()

        this.set_next_run( Date.now() )
    }

    // Maybe? an issue if new query_ready changes after awaiting
    query_ready() {
        return this.next_run
    } 

    set_next_run ( date ) {
        this.next_run =  date_promise( date )
    }
 
    async run() {
        while (true) { 
            await this.query_ready()

            await super.run.bind(this)()
        }
    }
}
