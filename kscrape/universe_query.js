

const { Query, client } = import("./query.js")


function retry(fn, retries=3, err=null) {
    if (!retries) {
      return Promise.reject(err);
    }
    return fn().catch(err => retry(fn, (retries - 1), err))
  }

function make_UniverseQuery(initial, detail, id_name) {

    class InitialQuery extends Query {
        async fetch() {
            const response = ( await client ).apis.Universe[initial]()
    
            const ids = ( await response ).obj

            ids.map(id => {

                let query_obj = new Object
                query_obj[id_name] = id

                const query = Specific_Query( query_obj )

                return retry(query.run, 3)

                })
    
            return Promise.all(ids)
        }
    
        save(data) {
            console.log("RegionsQuery save")
            //Specifics save data
        }
    } 
    
    class Specific_Query extends Query {
        constructor( query ) {
            this.query = query
        }
    
        async fetch() {
            const response = ( await client ).apis.Universe[detail]( this.query )
            return response.then( r => r.obj )
        }
    
        async save(data) {
            console.log(data)
        }
    } 

    return new InitialQuery()

}

const universe_query_helper = ( thing ) => {
    return  make_UniverseQuery(`get_universe_${thing}s`, `get_universe_${thing}s_${thing}_id`, `${thing}_id`)
}

exports.get_regions = universe_query_helper("region")
exports.get_constellations = universe_query_helper("constellation")
exports.get_systems = universe_query_helper("system")

exports.get_categorys = universe_query_helper("category")
exports.get_groups = universe_query_helper("group")
exports.get_types = universe_query_helper("type")

exports.get_graphics = universe_query_helper("graphic")