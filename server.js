require('dotenv').config()
//require modules
const express = require("express")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const session = require("express-session")
const PORT = process.env.PORT || 3000

const app = express()

//require db
require("./db/db")

//middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(methodOverride("_method"))
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))

app.use((req, res, next) => {
	try {
		if(req.session.loggedIn) {
			res.locals.user = req.session.user
		} else {
			res.locals.user = undefined
		}
		next()// 
	} catch(err) {
		next(err)
	}
})

app.use(express.static("public"))

//controllers
const userController = require("./controllers/user-controller")
app.use("/user", userController)


const movieReviewController = require("./controllers/movieReviewController")
app.use("/movies", movieReviewController)

app.get('/', (req,res,next) => {
	res.redirect("/movies/feed")
})

app.get('*', (req, res) => {
	res.render('404.ejs')
})

app.listen(PORT, () => {
	console.log("listening on port ", PORT);
})