
const MongoClient = require('mongodb').MongoClient;
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const connStr =process.env.MONGODB_URI || "mongodb+srv://sammysekyere:cs20123@cluster0.tgnobxn.mongodb.net/?appName=Cluster0";
//const connStr = process.env.MONGODB_URI || "mongodb+srv://ronjanmian:Password1@cluster0.ch6vfzt.mongodb.net/?appName=Cluster0";
//const PORT = process.env.PORT || 3000;
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
    app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

  } catch (err) {
    console.log("Database error: " + err);
  }
}

startServer();


// server.js
// Express + MongoDB + static hosting for CultureCraft

// const express = require("express");
// const path = require("path");
// const { MongoClient, ServerApiVersion } = require("mongodb");

// const app = express();
// const PORT = process.env.PORT || 3000;

// // 1. Your Atlas URI (update username, password, DB name)
// const uri =
//  "mongodb+srv://ronjanhusainmian_db_user:ronjanmian11@cluster0.tgnobxn.mongodb.net/?appName=Cluster0";


// // 2. Create Mongo client with serverApi options (Atlas likes this)
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// let db;

// async function startServer() {
//   try {
//     // 3. Connect to MongoDB Atlas
//     await client.connect();
//     console.log("✅ Connected to MongoDB Atlas");

//     // 4. Select your database
//     db = client.db("YOUR_DB"); // must match the DB in the URI

//     // 5. Serve static files from /public
//     app.use(express.static(path.join(__dirname, "public")));

//     // 6. Simple test route to prove Mongo is working
//     app.get("/products/example", async (req, res) => {
//       try {
//         const coll = db.collection("YOUR_COLLECTION_NAME"); // use a real collection name
//         const docs = await coll.find({}).limit(5).toArray();
//         res.json(docs);
//       } catch (err) {
//         console.error("Error in /products/example:", err);
//         res.status(500).json({ error: "Internal server error" });
//       }
//     });

//     // 7. Start the web server
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ Failed to connect to MongoDB:", err);
//     process.exit(1);
//   }
// }

// startServer();
