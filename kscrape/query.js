class Query {
    async run() {
        const data = await this.fetch()

        return this.save(data)
    }

    fetch() {

    }

    save(data) {
        console.log("query save")
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

            return setTimeout(fn, diff > 0 ? diff : 500);
        }
        return new Promise((resolve) => setToHappen(resolve, this.next_run))
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

export { Query, RepeatQuery }