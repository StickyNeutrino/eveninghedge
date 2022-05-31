

export function retry(fn, retries=3, err=null) {
    if (!retries) {
        console.log("retry fail:", err)
        return Promise.reject(err);
    }
    return fn().catch( err => {
        console.warn("retrying")
        return retry(fn, (retries - 1), err)
    })
}


export function date_promise( date ){
    const min_time =  5000

    return new Promise((resolve) => {
        const wait_time = new Date(date) - Date.now()
        setTimeout(resolve, wait_time > min_time ? wait_time : min_time);
    })
}

export function range(start = 0, end = Infinity, step = 1) {
    return {
        from: start,
        to: end,
        [Symbol.iterator]() {
            this.current = this.from;
            return this;
        },
        
       next() {
            if (this.current <= this.to) {
                return { done: false, value: this.current++ };
            } else {
                return { done: true };
            }
        }
    }
}
