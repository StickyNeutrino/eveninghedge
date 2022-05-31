

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