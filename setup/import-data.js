const fs = require('fs');
const xlsx = require('xlsx');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 1188,
  user: 'postgres',
  password: 'acidrain',
  database: 'sql_demo'
});

async function main() {
  try {
    await pool.connect();

    const workbook = xlsx.readFile('sbctc.xlsx');
    const worksheet = workbook.Sheets['IT Prof Tech Programs'];
    const data = xlsx.utils.sheet_to_json(worksheet);

    for (let row of data) {
      const query = {
        text: 'INSERT INTO mytable ("College", "Program Type", "Program Name", "Category", "Region") VALUES ($1, $2, $3, $4, $5)',
        values: [row['College'], row['Program Type'], row['Program Name'], row['Category'], row['Region']]
      };
      await pool.query(query);
    }
    

    console.log('Data imported successfully');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
// -- Table: public.mytable

// -- DROP TABLE IF EXISTS public.mytable;

// CREATE TABLE IF NOT EXISTS public.mytable
// (
//     "College" text COLLATE pg_catalog."default",
//     "Program Type" text COLLATE pg_catalog."default",
//     "Program Name" text COLLATE pg_catalog."default",
//     "Category" text COLLATE pg_catalog."default",
//     "Region" text COLLATE pg_catalog."default",
//     "Hyperlink" text COLLATE pg_catalog."default"
// )

// TABLESPACE pg_default;

// ALTER TABLE IF EXISTS public.mytable
//     OWNER to postgres;