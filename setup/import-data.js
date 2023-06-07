const xlsx = require("xlsx");
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 1188,
  user: "postgres",
  password: "acidrain",
  database: "sql_demo",
});

async function dropAndImportData() {
  try {
    await pool.query("DROP TABLE IF EXISTS mytable");

    await pool.connect();

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS mytable (
        id serial PRIMARY KEY,
        "College" text COLLATE pg_catalog."default",
        "Category" text COLLATE pg_catalog."default",
        "Program Type" text COLLATE pg_catalog."default",
        "Program Name" text COLLATE pg_catalog."default",
        "Region" text COLLATE pg_catalog."default",
        "HyperLink" text COLLATE pg_catalog."default"
      );
    `;

    await pool.query(createTableQuery);

    const workbook = xlsx.readFile("sbctc2.xlsx");
    const worksheet = workbook.Sheets["Sheet1"];
    const data = xlsx.utils.sheet_to_json(worksheet);

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];

      // Check for hyperlink in column D
      const hyperlinkObject = worksheet[`D${rowIndex + 1}`];
      const url =
        hyperlinkObject && hyperlinkObject.l && hyperlinkObject.l.Target
          ? hyperlinkObject.l.Target
          : "";

      // Check for hyperlink in column C
      const hyperlinkCellC = worksheet[`C${rowIndex + 1}`];
      const hyperlinkC =
        hyperlinkCellC && hyperlinkCellC.l && hyperlinkCellC.l.display
          ? hyperlinkCellC.l.display
          : "";

      // Choose the hyperlink that's not empty
      const hyperlink = url || hyperlinkC || "";
      console.log(row["Program Type"] + " " + hyperlink);
      const insertQuery = {
        text: 'INSERT INTO mytable ("College", "Category","Program Type", "Program Name",  "Region", "HyperLink") VALUES ($1, $2, $3, $4, $5, $6)',
        values: [
          row["College"],
          row["Category"],
          row["Program Type"],
          row["Program Name"],
          row["Region"],
          hyperlink,
        ],
      };

      await pool.query(insertQuery);
    }

    console.log("Data imported successfully");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

dropAndImportData();
