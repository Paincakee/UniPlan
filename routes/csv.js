const express = require('express');
const app = express();
const router = express.Router();
var bodyParser = require("body-parser");
var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));


router.get("/", (req, res) => {
  res.render("csv/import");
});

router.post("/", upload.single('csv'), (req, res) => {
  var b = req.file["buffer"]
  console.log(b.toString())
  res.send(b.toString())
});

module.exports = router;