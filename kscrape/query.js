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
        this.next_run = Date.now()
    }

    // Maybe? an issue if new query_ready changes after awaiting
    get query_ready() {
        date_promise( this.next_run )
    }

    set query_ready ( date ) {
        this.next_run = new Date( date ) 
    }
 
    async run() {
        while (true) {
            await this.query_ready

            await super.run.bind(this)()
        }
    }
}

function date_promise( date ){
    const min_time = 500 

    return new Promise((resolve) => {
        const wait_time =  date - Date.now()

        setTimeout(resolve, wait_time > min_time ? wait_time : min_time);
    })
}
