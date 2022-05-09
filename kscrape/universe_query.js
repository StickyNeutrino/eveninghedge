

import { Query, client } from "./query.js";
import { sql } from "./db.js";

function retry(fn, retries=3, err=null) {
    if (!retries) {
        console.log("retry fail:", err)
        return Promise.reject(err);
    }
    return fn().catch(err => {console.log("retrying"); retry(fn, (retries - 1), err)})
  }

class UniverseQuery extends Query {
    constructor( thing,  plural){
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
            ids.map(id => {
    
                let query_obj = new Object
                query_obj[this.id_name] = id
    
                const query = new Specific_Query( query_obj, this.detail, this.id_name, this.db_table )
    
                return retry(query.run.bind(query), 3)
    
                }))
    }

    save(data) {
        //Specifics save data
    }
} 

class Specific_Query extends Query {
    constructor( query, detail, id_name , db_table) {
        super()
        this.query = query
        this.detail = detail
        this.id_name = id_name
        this.db_table = db_table
    }

    async fetch() {
        const response = ( await client ).apis.Universe[this.detail]( this.query ).catch(e => console.log(e.response.statusText))
        return response.then( r => ({ id: this.query[this.id_name], info: JSON.stringify(r.obj) }))
        
    }

    async save(data) {
        return sql` INSERT INTO ${ sql(this.db_table) } 
            ${ sql( data, 'id', 'info') }
            ON CONFLICT DO NOTHING`
    }
} 


const get_regions = new UniverseQuery("region")
const get_constellations = new UniverseQuery("constellation")
const get_systems = new UniverseQuery("system")

export { get_regions, get_constellations, get_systems }

const get_categorys = new UniverseQuery("category", "categories")
const get_groups = new UniverseQuery("group")
const get_types = new UniverseQuery("type")
export { get_groups, get_types, get_categorys } 

const get_graphics = new UniverseQuery("graphic")
export { get_graphics }

export const all_queries = [ get_regions, get_constellations, get_systems, get_groups, get_types, get_graphics, get_categorys]
