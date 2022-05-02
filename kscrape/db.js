import postgres from 'postgres'

const sql = postgres('postgres://postgres@kscrape_db', {
    "password": process.env.POSTGRES_PASSWORD
})

export { sql }