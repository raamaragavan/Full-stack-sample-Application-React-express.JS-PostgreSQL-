const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'Rohit@2024',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'postgres'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};