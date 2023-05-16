const db = require('./utils/Database.js')
const dotenv = require("dotenv")
const express = require('express');
const app = express();

dotenv.config()
db.connect()

app.set('view engine', 'ejs')

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use("/account", require("./routes/account"))
app.use("/project", require("./routes/project.js"))

app.listen(3000)


global.db = db