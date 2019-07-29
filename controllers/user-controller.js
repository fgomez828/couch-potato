const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()

const User = require("../models/user")

//index
router.get("/", (req, res, next) => {
	res.render("users/login.ejs",)
})

/**AUTHENTICATION**/
//login
router.post("/login", (req, res, next) => {
	res.send("check once registration is complete")
})

//register
router.get("/register", (req, res, next) => {
	res.render("users/register.ejs", {
		message: req.session.message
	})
})

//new
router.post("/new", async (req, res, next) => {
	// const duplicateUser = await User.find({name: req.body.name})
	try {
		// if(!duplicateUser) {
			//secure password
			const password = req.body.password
			const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
			req.body.password = hashedPassword
			//create user
			const newUser = await User.create(req.body)
			//set session
			req.session.userId = newUser._id
			req.session.username = newUser.name
			req.session.loggedIn = true
			// redirect
			res.send("created account successfully")
		// } else {
			// req.session.message = "That username already exists. Try another one."
		// }
	} catch(err) {
		next(err)
	}
})

//logout


/**REST**/
//show

//edit -- to edit own profile

//update -- to update own profile

//delete -- to delete own account

module.exports = router