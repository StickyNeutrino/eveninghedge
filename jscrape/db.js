const postgres = require('postgres')

const sql = postgres('postgres://postgres@database', {
    "password": process.env.POSTGRES_PASSWORD
})

module.exports = sql