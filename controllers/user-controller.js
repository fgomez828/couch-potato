const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()

const User = require("../models/user")


//index
router.get("/", (req, res, next) => {
	res.render("users/login.ejs", {
		message: req.session.message
	})
})

/**AUTHENTICATION**/
//login
router.post("/login", async (req, res, next) => {
	try {
		const existingUser = await User.findOne({name: req.body.name})
		//check password
		if(bcrypt.compareSync(req.body.password, existingUser.password)) {
			//set session
			req.session.user = existingUser
			req.session.userId = existingUser._id
			req.session.username = existingUser.name
			req.session.loggedIn = true

			res.redirect("/movies/feed")

		} else {
			req.session.message = "Wrong Password"
			res.redirect("/user")
		}
	} catch(err) {
		next(err)
	}
})

//register
router.get("/register", (req, res, next) => {
	res.render("users/register.ejs", {
		message: req.session.message
	})
})

//new
router.post("/new", async (req, res, next) => {
	try {
		const duplicateUser = await User.findOne({name: req.body.name})
		if(!duplicateUser) {
			//secure password
			const password = req.body.password
			const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
			req.body.password = hashedPassword
			//create user
			const newUser = await User.create(req.body)
			//set session
			req.session.user = newUser
			req.session.userId = newUser._id
			req.session.username = newUser.name
			req.session.loggedIn = true
			// redirect

			res.redirect("/movies/feed")

		} else {
			req.session.message = "That username already exists. Try another one."
			res.redirect("/user/register")
		}
	} catch(err) {
		next(err)
	}
})

//logout
router.get("/logout", (req, res, next) => {
	req.session.destroy((err) => {
		if(err) next(err);
		else res.redirect("/user")
	})
})


/**REST**/
// show
router.get("/:_id", (req, res, next) => {
	console.log("hitting user show route");
	res.render("users/show.ejs", {
		user: req.session.user,
		userName: req.session.user.name
	})
})

//edit -- to edit own profile

//update -- to update own profile

//delete -- to delete own account

module.exports = router


