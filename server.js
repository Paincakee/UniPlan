const express = require('express')
const db = require('./utils/Database.js')
const app = express()
const dotenv = require("dotenv")
dotenv.config()
db.connect()

app.set('view engine', 'ejs')

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


const account = require("./routes/account")
const csvImport = require("./routes/csv")

app.use("/account", account)
app.use("/csv", csvImport)

app.listen(3000)


global.db = db