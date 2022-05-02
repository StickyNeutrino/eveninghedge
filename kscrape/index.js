import { all_queries } from "./universe_query.js";

async function main () {
    console.log("main")
    console.time('all')
    await Promise.all(all_queries.map( q => q.run()))
    console.timeEnd('all')
    
} 

main()
