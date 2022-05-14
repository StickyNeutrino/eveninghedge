import { get_regions } from "./universe_query.js";
import { MarketRegionQuery } from "./market_query.js";
import { sql } from "./db.js";

async function main () {
    console.log("main")

    console.time("Regions")
    await get_regions.run()
    console.timeEnd("Regions")

    const records = await sql`
    SELECT id FROM regions
    LIMIT 3
    `
    const ids = records.map( record => record.id)
    
    ids.map(id => {
        new MarketRegionQuery( id ).run()
    });
    
} 

main()
