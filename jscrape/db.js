const postgres = require('postgres')

const sql = postgres('postgres://postgres@database', {
    "password": process.env.POSTGRES_PASSWORD
})

exports.sql = sql


exports.existing_region_ids = async () => {
    const objs = await sql`SELECT region_id FROM regions` 

    return objs.map(obj =>  {  return obj.region_id    })
}

exports.insert_regions = ( regions ) => {
    if ( regions.length ){
        return sql`
        INSERT INTO regions ${
            sql( regions, 'region_id', 'name', 'description')
        }
        `
    }
}

exports.existing_constellations_ids = async () => {
    const objs = await sql`SELECT constellation_id FROM constellations` 

    return objs.map(obj =>  {  return obj.constellation_id    })
}

exports.insert_constellations = ( constellations ) => {
    if ( constellations.length ){
        const flatten_position = ( constellations ) => {
            return { 
                ...constellations,
                x: constellations.position.x,
                y: constellations.position.y,
                z: constellations.position.z }
        }

        return sql`
        INSERT INTO constellations ${
            sql( constellations.map( flatten_position ), 'constellation_id', 'name', 'region_id', 'x', 'y', 'z')
        }
        `
    }
}