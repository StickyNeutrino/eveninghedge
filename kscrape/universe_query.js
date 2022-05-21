import { Query } from "./query.js";
import { insert_universe_info } from "./db.js";
import { client } from "./api.js"

class UniverseQuery extends Query {
    constructor( thing,  plural ){
        super()
        const plural_thing = plural || thing + 's'
        this.initial = `get_universe_${ plural_thing }`
        this.detail =  `get_universe_${ plural_thing }_${thing}_id`
        this.id_name = `${thing}_id`
        this.db_table = plural_thing
    }

    async fetch() {
        const response = ( await client ).apis.Universe[ this.initial ]()

        const ids = ( await response ).obj

        return Promise.all(
            ids
            .map(id => new Specific_Query( id, this.detail, this.id_name, this.db_table ) )
            .map(query => retry(query.run.bind(query), 3)))
    }
} 

class Specific_Query extends Query {
    constructor( id, detail, id_name , db_table) {
        super()
        this.db_table = db_table

        let query = new Object
        query[id_name] = id

        this.fetch_function = () => client.then( c => () => ( c.apis.Universe[detail]( query ) ) )
        this.transform_response = async ( resp ) => ({ id: query[id_name], info: JSON.stringify(await resp.obj) })
        
    }

    async fetch() {
        return transform_response(fetch_function())
    }

    async save(data) {
        return insert_universe_info( data, this.db_table )
    }
} 

function retry(fn, retries=3, err=null) {
    if (!retries) {
        console.log("retry fail:", err)
        return Promise.reject(err);
    }
    return fn().catch( err => {
        console.warn("retrying")
        return retry(fn, (retries - 1), err)
    })
}



export const get_regions = new UniverseQuery("region")
export const get_constellations = new UniverseQuery("constellation")
export const get_systems = new UniverseQuery("system")

export const get_categorys = new UniverseQuery("category", "categories")
export const get_groups = new UniverseQuery("group")
export const get_types = new UniverseQuery("type")

export const get_graphics = new UniverseQuery("graphic")

export const all_queries = [ get_regions, get_constellations, get_systems, get_groups, get_types, get_graphics, get_categorys ]
