const pg = require('pg');
const {
    Pool
} = pg;

const pool = new Pool({
    user: process.env.PSQL_USERNAME,
    password: process.env.PSQL_PASSWORD,
    database: process.env.PSQL_DATABASE,
    port: process.env.PSQL_HOSTPORT,
    host: process.env.PSQL_HOSTNAME,
});

module.exports = {
    pool
};