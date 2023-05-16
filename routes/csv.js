const express = require('express')
const app = express()
const router = express.Router()
const csv = require('csv-parser')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add a middleware to set the 'Content-Type' header
app.use((req, res, next) => {
  req.headers['content-type'] = 'multipart/form-data';
  next();
})


router.get("/", (req, res) => {
    res.render("csv/import")
  })
  
  router.post("/", (req, res) => {
    // console.log('success')
    // res.render("csv/import")
  
    // if (!req.file) {
    //   res.status(400).send('No file uploaded.');
    //   return;
    // }
  
    // Access the CSV data in req.file.buffer
    const csvData = req.file.buffer.toString();
  
    // Process the CSV data using csv-parser
    const results = [];
    csv.parse(csvData)
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // Do something with the parsed CSV data
        console.log(results);
        res.send('File uploaded and processed successfully.');
      });
  })
  
  module.exports = router;