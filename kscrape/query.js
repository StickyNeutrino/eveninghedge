export class Query {
    async run() {
        const data = await this.fetch()

        return this.save(data)
    }

    fetch() { }

    save(data) {
        //Should not run
        console.log("Empty Save", data)
    }
}

export class RepeatQuery extends Query {

    constructor() {
        super()
        console.log("RepeatQuery")
        this.next_run =  date_promise( Date.now() )
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
            console.log(this.page, "waiting")
            await this.query_ready()
            console.log(this.page, "running")
            await super.run.bind(this)()
        }
    }
}

function date_promise( date ){
    const min_time =  5000

    return new Promise((resolve) => {
        const wait_time = new Date(date) - Date.now()
        setTimeout(resolve, wait_time > min_time ? wait_time : min_time);
    })
}
