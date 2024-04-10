// Import required modules
const express = require("express");
const xml2js = require("xml2js");
const parquet = require("parquetjs");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
// Create Express app
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://duummmyyyy1323:yxaq42XwIqwymbqp@cluster0.xz21jt1.mongodb.net/?retryWrites=true&w=majority",
    {}
  )
  .then(() => console.log("connnected to DB"))
  .catch(console.error);

const XmlFile = require("./models/XmlFileModel");

// Upload endpoint
app.post("/upload", async (req, res) => {
  try {
    const { xml, fileName, contentType } = req.body;

    // Create a new instance of XmlFile model
    const newXmlFile = new XmlFile({
      fileName,
      xmlString: xml,
      contentType,
    });

    // Save the new XmlFile instance to MongoDB
    const savedXmlFile = await newXmlFile.save();

    res.status(200).json(savedXmlFile);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Fetch all XML files endpoint
app.get("/xmlfiles", async (req, res) => {
  try {
    // Find all XML files from the database
    const allXmlFiles = await XmlFile.find();

    res.status(200).json(allXmlFiles);
    console.log("fetched all XML files");
  } catch (error) {
    console.error("Error fetching XML files:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/convert", async (req, res) => {
  // XML data
  const xmlData = req.body.xml;

  try {
    const parser = new xml2js.Parser();
    parser.parseString(xmlData, async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      const books = result.catalog.book.map((book) => ({
        id: book.$.id,
        author: book.author[0],
        title: book.title[0],
        genre: book.genre[0],
        price: parseFloat(book.price[0]),
        publish_date: book.publish_date[0],
        description: book.description[0],
      }));

      const schema = new parquet.ParquetSchema({
        id: { type: "UTF8" },
        author: { type: "UTF8" },
        title: { type: "UTF8" },
        genre: { type: "UTF8" },
        price: { type: "DOUBLE" },
        publish_date: { type: "UTF8" },
        description: { type: "UTF8" },
      });
      const fileName = `output${Date.now()}.parquet`;
      // Specify the output file path
      const outputPath = path.join(__dirname, "output", fileName);

      const writer = await parquet.ParquetWriter.openFile(schema, outputPath);

      books.forEach((book) => {
        writer.appendRow(book);
      });

      writer.close(async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
        console.log("Parquet file saved successfully.");
        return res
          .status(200)
          .send({ url: `http://localhost:3000/output/${fileName}` });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "output", "output.parquet");
  res.download(filePath);
});

// Serve the output Parquet file statically
app.use("/output", express.static(path.join(__dirname, "output")));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
