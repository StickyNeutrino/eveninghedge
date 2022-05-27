import { all_queries } from "./universe_query.js";
import { MarketRegionQuery } from "./market_query.js";
import { sql } from "./db.js";

async function main () {
    console.log("main")

    console.time("all")
    await Promise.all( all_queries.map(  (q) => q.run() ))
    console.timeEnd("all")

    const records = await sql`
    SELECT id FROM regions
    LIMIT 1
    `
    records
    .map( record => record.id)
    .map( id =>  new MarketRegionQuery( id ).run() )
    
} 

main()
