const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

const { Pool } = require('pg');


const port = 8000;

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  host: 'localhost',
  port: 1188,
  user: 'postgres',
  password: 'acidrain',
  database: 'sql_demo'
});

// Define a route that retrieves all data from the "mytable" table
app.get('/api/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM mytable');
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
