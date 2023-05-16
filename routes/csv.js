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
  var buff = req.file["buffer"]
  var buffstring = buff.toString()
  const mailarray = buffstring.split("\r\n")
  console.log(mailarray)
  res.send(mailarray)
  mailSend(mailarray)
});

module.exports = router;


async function mailSend(list){
        // send mail with defined transport object
        let info = await global.sender.sendMail({
          from: '"pixeltrading" pixeltrading@outlook.com', // sender address
          to: list, // list of receivers
          subject: "UniPlan account creation", // Subject line
          text: "Create your account here", // plain text body
          html: "<a href='localhost:3000/account/new'>", // html body
        });
          
        console.log("Message sent: %s", info.messageId);
}