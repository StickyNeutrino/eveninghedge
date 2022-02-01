const eve_api = require("./api.js");
const fs = require('fs').promises;
const sql = require('./db.js')

sql`
  select name from locations
`.then( result => 
{

    console.log(result)
})

console.time('all_orders')
eve_api.all_orders(10000002).then(array => {
    Promise.all(array.map(async (page_promise) => {
        let page = await page_promise;

        let page_string = JSON.stringify(page);

        let filename = page.headers["etag"];

        return fs.writeFile("/data/" + filename, page_string)

    }))
    console.timeEnd('all_orders')
})