const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require('mongodb');

let mongoClient;

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = "centerOfExcellence";
const collectionName = "collegeProgram";

const connectMongoClient = async () => {
  if (!mongoClient) {
    try {
      mongoClient = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Failed to connect to MongoDB", err);
      throw err;
    }
  }
  return mongoClient;
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.get("/api/data", async (req, res) => {
    try {
        const client = await connectMongoClient();
        const collection = client.db(dbName).collection(collectionName);
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error", message: err.message });
    }
});

app.post("/api/insert", async (req, res) => {
    try {
        const client = await connectMongoClient();
        const collection = client.db(dbName).collection(collectionName);
        const { College, ProgramType, ProgramName, Category, Region, Hyperlink } = req.body;
        const result = await collection.insertOne({ College, ProgramType, ProgramName, Category, Region, Hyperlink });
        
        res.status(201).json({ insertedId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error", message: err.message });
    }
});

app.delete("/api/delete/:id", async (req, res) => {
    try {
        const client = await connectMongoClient();
        const collection = client.db(dbName).collection(collectionName);
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID format");
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        res.sendStatus(result.deletedCount > 0 ? 200 : 404);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error", message: err.message });
    }
});

app.put("/api/data/:id", async (req, res) => {
    try {
        const client = await connectMongoClient();
        const collection = client.db(dbName).collection(collectionName);
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID format");
        }

        const updatedRow = req.body;
        delete updatedRow._id; // Ensure _id is not part of the update

        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedRow });
        res.sendStatus(result.modifiedCount > 0 ? 200 : 404);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error", message: err.message });
    }
});


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
