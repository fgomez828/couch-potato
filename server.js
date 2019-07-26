//require modules
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const session = require("express-session")
const PORT = 3000

const app = express()

//require db
require("./db/db")

app.listen(PORT, () => {
	console.log("listening on port ", PORT);
})