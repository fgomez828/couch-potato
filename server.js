//require modules
const express = require("express")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const session = require("express-session")
const PORT = 3000

const app = express()

//require db
require("./db/db")

//middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(methodOverride("_method"))
app.use(session({
	secret: "eGpqKoyWC913mBHZKrqo",
	resave: false,
	saveUninitialized: false
}))


//controllers
const userController = require("./controllers/user-controller")
app.use("/user", userController)


const movieReviewController = require("./controllers/movieReviewController")
app.use("/movies", movieReviewController)

app.listen(PORT, () => {
	console.log("listening on port ", PORT);
})