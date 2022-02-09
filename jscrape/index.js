const eve_api = require("./api.js");
const db = require('./db.js')

const gen_fetch = (get_api_ids, get_db_ids, get_api_infos, insert_db) => {
    return async () => {
        const api_ids = get_api_ids()

        const db_ids = await get_db_ids()

        const new_ids = ( await api_ids ).filter( (id) => ! db_ids.includes(id)  ) 
    
        const new_info = await get_api_infos( new_ids )
    
        return insert_db( new_info )
    }
}

const single_info_wrapper = ( get_info ) => {
    return async ( ids ) => {
        const new_info_fetch = ids.map( async (id) => {
            try {
                return get_info( id )
            } catch ( e ) {
                console.error(e);
                return null
            } 
        })

        const new_info = Promise.all( new_info_fetch ).then( (info_with_nulls) => { 
            return info_with_nulls.filter( (info) => info != null )})

        return new_info
    }
}

const fetch_regions = gen_fetch(
    eve_api.region_ids ,
    db.existing_region_ids,
    single_info_wrapper( eve_api.region_info ), 
    db.insert_regions)
    

const fetch_constellations = gen_fetch(
    eve_api.constellation_ids ,
    db.existing_constellation_ids,
    single_info_wrapper( eve_api.constellation_info ), 
    db.insert_constellations)

const fetch_locations = gen_fetch(
    eve_api.location_ids ,
    db.existing_location_ids,
    eve_api.locations_info, 
    db.insert_locations)


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

    console.time('fetch_locations')
    //await fetch_locations()
    console.timeEnd('fetch_locations')

    console.time('db.sql')
    await db.sql`
        SELECT pg_size_pretty(pg_database_size('postgres'));
    `.then(console.log)
    console.timeEnd('db.sql')
}

main()
