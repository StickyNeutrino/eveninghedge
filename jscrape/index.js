const eve_api = require("./api.js");
const db = require('./db.js')

const gen_fetch = (get_api_ids, get_db_ids, get_api_info, insert_db) => {
    return async () => {
        const api_ids = get_api_ids()

        const db_ids = await get_db_ids()
    
        const new_ids = ( await api_ids ).filter( (id) => ! db_ids.includes(id)  ) 
    
        const new_info_fetch = new_ids.map( async (id) => {
            try {
                return await get_api_info(id)
            } catch (e) {
                console.log(" caught error ")
                return null 
            }
        })

        const new_info = await Promise.all( new_info_fetch )

    
        return insert_db(new_info.filter( (info) => info != null ))
    }
}

const fetch_regions = gen_fetch(
    eve_api.region_ids ,
    db.existing_region_ids,
    eve_api.region_info, 
    db.insert_regions)
    

const fetch_constellations = gen_fetch(
    eve_api.constellations_ids ,
    db.existing_constellations_ids,
    eve_api.constellations_info, 
    db.insert_constellations)


const main = async () => {

    console.time('load_client')
    await eve_api.load_client()
    console.timeEnd('load_client')

    console.time('fetch_region')
    await fetch_regions()
    console.timeEnd('fetch_region')

    console.time('fetch_constellations')
    await fetch_constellations()
    console.timeEnd('fetch_constellations')

    console.time('db.sql')
    await db.sql`
        SELECT name 
        FROM constellations
    `.then(console.log)
    console.timeEnd('db.sql')
}

main()
