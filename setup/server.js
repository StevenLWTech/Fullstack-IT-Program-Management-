const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { Pool } = require("pg");
const cors = require("cors");

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

const pool = new Pool({
  host: "localhost",
  port: 1188,
  user: "your_user",
  password: "your_password",
  database: "your_database",
});

const port = 9000;

app.get("/api/data", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM mytable");
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.post("/api/insert", async (req, res) => {
  try {
    const sql = `INSERT INTO mytable ("College", "Program Type", "Program Name", "Category", "Region", "Hyperlink") VALUES ($1, $2, $3, $4, $5, $6)`;
    const {
      College,
      ["Program Type"]: programType,
      ["Program Name"]: programName,
      Category,
      Region,
      Hyperlink,
    } = req.body;
    console.log(res.body);
    console.log(College);
    console.log(programType);
    console.log(programName);
    console.log(Category);
    console.log(Region);
    console.log(Hyperlink);
    const client = await pool.connect();

    console.log(sql);
    const values = [
      College,
      programType,
      programName,
      Category,
      Region,
      Hyperlink,
    ];
    console.log(values);

    await client.query(sql, values);
    client.release();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
app.delete("/api/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    const sql = "DELETE FROM mytable WHERE id = $1";
    console.log(sql) 
    const values = [id];
    console.log(values);
    await client.query(sql, values);
    client.release();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.put("/api/data/:id", async (req, res) => {
  const { id } = req.params;
  const updatedRow = req.body;
  console.log(updatedRow);
  try {
    const client = await pool.connect();

    // Update the row in the database
    await client.query(
      'UPDATE mytable SET "College" = $1, "Program Type" = $2, "Program Name" = $3, "Category" = $4, "Region" = $5, "Hyperlink" = $6 WHERE "id" = $7',
      [
        updatedRow.College,
        updatedRow["Program Type"],
        updatedRow["Program Name"],
        updatedRow.Category,
        updatedRow.Region,
        updatedRow.Hyperlink,
        id,
      ]
    );

    client.release();

    res.sendStatus(200); // Send a success status code
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
