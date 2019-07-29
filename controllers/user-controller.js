const express = require("express")
const router = express.Router()

const User = require("../models/user")


//movie home page
router.get("/", (req, res, next) => {
	res.render("users/login.ejs")
})



/**REST**/
//show 

//edit -- to edit own profile

//update -- to update own profile

//delete -- to delete own account

module.exports = router