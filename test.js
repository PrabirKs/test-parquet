// // Import required modules
// const express = require('express');
// const xml2js = require('xml2js');
// const parquet = require('parquetjs');
// const fs = require('fs');
// const path = require('path');

// // Create Express app
// const app = express();
// const port = 3000; // You can change the port if needed

// // Define route for converting XML to Parquet
// app.get('/convert', async (req, res) => {
//     // XML data
//     const xmlData = `<?xml version="1.0"?>
//     <catalog>
//        <book id="bk101">
//           <author>Gambardella, Matthew</author>
//           <title>XML Developer's Guide</title>
//           <genre>Computer</genre>
//           <price>44.95</price>
//           <publish_date>2000-10-01</publish_date>
//           <description>An in-depth look at creating applications 
//           with XML.</description>
//        </book>
//        <book id="bk102">
//           <author>Ralls, Kim</author>
//           <title>Midnight Rain</title>
//           <genre>Fantasy</genre>
//           <price>5.95</price>
//           <publish_date>2000-12-16</publish_date>
//           <description>A former architect battles corporate zombies, 
//           an evil sorceress, and her own childhood to become queen 
//           of the world.</description>
//        </book>
//     </catalog>`;

//     try {
//         const parser = new xml2js.Parser();
//         parser.parseString(xmlData, async (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('Internal Server Error');
//             }

//             const books = result.catalog.book.map(book => ({
//                 id: book.$.id,
//                 author: book.author[0],
//                 title: book.title[0],
//                 genre: book.genre[0],
//                 price: parseFloat(book.price[0]),
//                 publish_date: book.publish_date[0],
//                 description: book.description[0]
//             }));

//             const schema = new parquet.ParquetSchema({
//                 id: { type: 'UTF8' },
//                 author: { type: 'UTF8' },
//                 title: { type: 'UTF8' },
//                 genre: { type: 'UTF8' },
//                 price: { type: 'DOUBLE' },
//                 publish_date: { type: 'UTF8' },
//                 description: { type: 'UTF8' }
//             });

//             // Specify the output file path
//             const outputPath = path.join(__dirname, 'output', 'output.parquet');
            
//             const writer = await parquet.ParquetWriter.openFile(schema, outputPath);

//             books.forEach(book => {
//                 writer.appendRow(book);
//             });

//             writer.close(async err => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).send('Internal Server Error');
//                 }
//                 console.log('Parquet file saved successfully.');
//                 return res.status(200).send('Parquet file saved successfully.');
//             });
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send('Internal Server Error');
//     }
// });

// // Define route for downloading the Parquet file
// app.get('/download', (req, res) => {
//     const filePath = path.join(__dirname, 'output', 'output.parquet');
//     res.download(filePath);
// });

// // Serve the output Parquet file statically
// app.use('/output', express.static(path.join(__dirname, 'output')));

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });









// // Import required modules
// const express = require("express");
// const xml2js = require("xml2js");
// const parquet = require("parquetjs");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");
// const sql = require("mssql");
// const { log } = require("console");
// // Create Express app
// const app = express();
// const port = 3000;
// app.use(express.json());
// app.use(cors());

// const s = async () => {
//     console.log("con started");
//   try {
//     // make sure that any items are correctly URL encoded in the connection string
//     await sql.connect(
//       "Server=SW0103021\SQLEXPRESS,1433;Database=BookStore;User Id=Prabira;Password=Prabir@123;Encrypt=true"
//     );
//     const result = await sql.query`SELECT TOP (1000) [Id],[Title],[Description] FROM [BookStore].[dbo].[Books]`;
//     console.log(result);
//   } catch (err) {
//     // ... error checks
//   }
// };
// s() ;
// // Endpoint to store XML data into SQL Server database
// app.post("/upload", async (req, res) => {
//   const xmlData = req.body.xml;
//   const fileName = req.body.fileName;
//   const contentType = req.body.contentType;
//   console.log(fileName, contentType);
//   try {
//     // Connect to SQL Server
//     await sql.connect(config);

//     // Create a new database if it doesn't exist
//     await sql.query`IF DB_ID('YourDatabase') IS NULL
//                       CREATE DATABASE YourDatabase`;

//     // Switch to the new database
//     config.database = "YourDatabase";

//     // Create the XmlData table if it doesn't exist
//     await sql.query`IF OBJECT_ID('XmlData', 'U') IS NULL
//                       CREATE TABLE XmlData (
//                         Id INT IDENTITY(1,1) PRIMARY KEY,
//                         FileName NVARCHAR(MAX),
//                         XmlContent NVARCHAR(MAX),
//                         ContentType NVARCHAR(MAX)
//                       )`;

//     // Insert data into the XmlData table
//     const dbStatus =
//       await sql.query`INSERT INTO XmlData (FileName, XmlContent, ContentType)
//                       VALUES (${fileName}, ${xmlData}, ${contentType})`;
//     console.log(dbStatus);
//     await sql.close();

//     console.log("XML data stored in SQL Server successfully.");
//     return res.status(200).send("XML data stored in SQL Server successfully.");
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/convert", async (req, res) => {
//   // XML data
//   const xmlData = req.body.xml;

//   try {
//     const parser = new xml2js.Parser();
//     parser.parseString(xmlData, async (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//       }

//       const books = result.catalog.book.map((book) => ({
//         id: book.$.id,
//         author: book.author[0],
//         title: book.title[0],
//         genre: book.genre[0],
//         price: parseFloat(book.price[0]),
//         publish_date: book.publish_date[0],
//         description: book.description[0],
//       }));

//       const schema = new parquet.ParquetSchema({
//         id: { type: "UTF8" },
//         author: { type: "UTF8" },
//         title: { type: "UTF8" },
//         genre: { type: "UTF8" },
//         price: { type: "DOUBLE" },
//         publish_date: { type: "UTF8" },
//         description: { type: "UTF8" },
//       });
//       const fileName = `output${Date.now()}.parquet`;
//       // Specify the output file path
//       const outputPath = path.join(__dirname, "output", fileName);

//       const writer = await parquet.ParquetWriter.openFile(schema, outputPath);

//       books.forEach((book) => {
//         writer.appendRow(book);
//       });

//       writer.close(async (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send("Internal Server Error");
//         }
//         console.log("Parquet file saved successfully.");
//         return res
//           .status(200)
//           .send({ url: `http://localhost:3000/output/${fileName}` });
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/download", (req, res) => {
//   const filePath = path.join(__dirname, "output", "output.parquet");
//   res.download(filePath);
// });

// // Serve the output Parquet file statically
// app.use("/output", express.static(path.join(__dirname, "output")));

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
