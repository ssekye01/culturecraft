
const MongoClient = require('mongodb').MongoClient;
const express = require('express');

const app = express();

const connStr = "mongodb+srv://sammysekyere:cs20123@cluster0.tgnobxn.mongodb.net/?appName=Cluster0";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const client = new MongoClient(connStr);

//serve files from "public" 
app.use(express.static("public"));


async function startServer() {
  try {
    await client.connect();

    const dbo = client.db("artists");

    // one collection per artist
    const clayColl   = dbo.collection("Clay Tales of Bengal");
    const japanColl  = dbo.collection("Treasures of Japan");  
    const parisColl  = dbo.collection("Parisian Heritage Collection");
    const yorubaColl  = dbo.collection("Yoruba Patterns of the Ancestors");


    // ---------- CLAY TALES ROUTE ----------
    app.get("/products/clay-tales", async function (req, res) {
      try {
        const options = {
          sort: { name: 1 },
          projection: { _id: 0 }
        };

        const cursor = clayColl.find({}, options);
        const docs = await cursor.toArray();

        if (docs.length === 0) {
          console.log("No Clay Tales products found!");
        }

        res.json(docs);
      } catch (err) {
        console.log("Clay Tales query error: " + err);
        res.status(500).send("Database query error");
      }
    });

    // ---------- TREASURES OF JAPAN ROUTE ----------
    app.get("/products/treasures-of-japan", async function (req, res) {
      try {
        const options = {
          sort: { name: 1 },
          projection: { _id: 0 }
        };

        const cursor = japanColl.find({}, options);
        const docs = await cursor.toArray();

        if (docs.length === 0) {
          console.log("No Japan products found!");
        }

        res.json(docs);
      } catch (err) {
        console.log("Japan query error: " + err);
        res.status(500).send("Database query error");
      }
    });

    // ---------- PARISIAN HERITAGE ROUTE ----------
    app.get("/products/parisian-heritage-collection", async function (req, res) {
      try {
        const options = {
          sort: { name: 1 },
          projection: { _id: 0 }
        };

        const cursor = parisColl.find({}, options);
        const docs = await cursor.toArray();

        if (docs.length === 0) {
          console.log("No Parisian Heritage products found!");
        }

        res.json(docs);
      } catch (err) {
        console.log("Parisian Heritage query error: " + err);
        res.status(500).send("Database query error");
      }
    });

    // ---------- YORUBA ROUTE ----------
    app.get("/products/yoruba", async function (req, res) {
      try {
        const options = {
          sort: { name: 1 },
          projection: { _id: 0 }
        };

        const cursor = yorubaColl.find({}, options);
        const docs = await cursor.toArray();

        if (docs.length === 0) {
          console.log("No Yoruba products found!");
        }

        res.json(docs);
      } catch (err) {
        console.log("Yoruba query error: " + err);
        res.status(500).send("Database query error");
      }
    });


    // ---------- START SERVER ----------
    // app.listen(3000, function () {
    //   console.log("Server running at http://localhost:3000");
    // });
     app.listen(PORT, function () {
      console.log("Server running at http://localhost:3000");
    });

  } catch (err) {
    console.log("Database error: " + err);
  }
}

startServer();


