import postgres from 'postgres'

const sql = postgres('postgres://postgres@kscrape_db', {
    "password": process.env.POSTGRES_PASSWORD
})

export { sql }

export async function insert_market_queries( queries ) {
    return sql`
    INSERT INTO market_queries 
    (type, query)
    values
      (${"get_markets_region_id_orders"}, ${ JSON.stringify(queries[0]) })
   ON CONFLICT DO NOTHING`.then(r => console.log(r))
}

export async function insert_order_observations( observations, query_id ){
    const with_query_id = ( observation ) => ({ query_id, ...observation })

    return sql`
    INSERT INTO order_observations 
    ${sql(observations.map(with_query_id), 'price', 'volume_remain', 'type', 'query_id')}    `

}