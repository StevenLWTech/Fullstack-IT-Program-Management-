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

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];
      
      // Check for hyperlink in column B
      const hyperlinkCellB = worksheet[`B${rowIndex + 1}`];
      const hyperlinkB = hyperlinkCellB && hyperlinkCellB.l && hyperlinkCellB.l.display ? hyperlinkCellB.l.display : "";
    
      // Check for hyperlink in column C
      const hyperlinkCellC = worksheet[`C${rowIndex + 1}`];
      const hyperlinkC = hyperlinkCellC && hyperlinkCellC.l && hyperlinkCellC.l.display ? hyperlinkCellC.l.display : "";
    
      // Choose the hyperlink that's not empty
      const hyperlink = hyperlinkC || hyperlinkB || "";
      console.log(row['Program Type'] + " " + hyperlink);
      const query = {
        text: 'INSERT INTO mytable ("College", "Program Type", "Program Name", "Category", "Region", "Hyperlink") VALUES ($1, $2, $3, $4, $5, $6)',
        values: [row['College'], row['Program Type'], row['Program Name'], row['Category'], row['Region'], hyperlink]
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
