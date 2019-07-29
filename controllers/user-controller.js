const express = require("express")
const router = express.Router()

const User = require("../models/user")


//index
router.get("/", (req, res, next) => {
	res.redirect("/user/login")
})

/**AUTHENTICATION**/
//login
router.get("/login", (req, res, next) => {
	res.render("users/login.ejs")
})

//register
router.get("/register", (req, res, next) => {
	res.render("users/register.ejs")
})


/**REST**/
//show 

//edit -- to edit own profile

//update -- to update own profile

//delete -- to delete own account

module.exports = router