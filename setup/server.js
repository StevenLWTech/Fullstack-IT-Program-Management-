const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { Pool } = require('pg');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

const pool = new Pool({
  host: 'localhost',
  port: 1188,
  user: 'postgres',
  password: 'acidrain',
  database: 'sql_demo'
});

const port = 8000;

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

app.post('/api/insert', async (req, res) => {
  try {
	const sql = `INSERT INTO mytable ("College", "Program Type", "Program Name", "Category", "Region", "Hyperlink") VALUES ($1, $2, $3, $4, $5, $6)`;
    const { College, ['Program Type']: programType, ['Program Name']: programName, Category, Region, Hyperlink } = req.body;
    console.log(res.body)
    console.log(College);
    console.log(programType);
    console.log(programName);
    console.log(Category);
    console.log(Region);
    console.log(Hyperlink);
    const client = await pool.connect();
    
    console.log(sql);
    const values = [College, programType, programName, Category, Region, Hyperlink];
    console.log(values);

    await client.query(sql, values);
    client.release();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
