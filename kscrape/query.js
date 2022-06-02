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
    get query_ready() {
        return this.next_run
    } 

    set_next_run ( date ) {
        this.next_run = date_promise( date )
    }
 
    async run() {
        while (this.query_ready != undefined) { 
            await this.query_ready

            this.next_run = undefined

            await super.run.bind(this)()
        }
    }
}
