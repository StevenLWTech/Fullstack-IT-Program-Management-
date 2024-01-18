// const { MongoClient } = require('mongodb');
// const uri = "mongodb://localhost:27017";
// const client = new MongoClient(uri);
const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017/centerOfExcellence";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const readXlsxFile = require('read-excel-file/node');
const path = require('path');

const excelFilePath = path.resolve(__dirname, 'sbctc2.xlsx');

async function importDataFromExcel() {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB.");

        const database = client.db("centerOfExcellence"); 
        const collection = database.collection("collegeProgram"); 

        // Read the Excel file
        const rows = await readXlsxFile(excelFilePath);
        // Skip the header row
        rows.shift();

        // Prepare data for MongoDB
        const documents = rows.map(row => ({
            College: row[0],
            ProgramType: row[1],
            ProgramName: row[2],
            Category: row[3],
            Region: row[4],
            Hyperlink: row[5],
        }));

        // Insert data into the MongoDB collection
        const result = await collection.insertMany(documents);
        console.log(`${result.insertedCount} documents were inserted.`);
    } catch (err) {
        console.error('Error while importing data: ', err);
    } finally {
        await client.close();
    }
}

importDataFromExcel().catch(console.dir);
