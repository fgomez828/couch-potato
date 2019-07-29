const express = require("express")
const router = express.Router()
const requireAuth = require("../lib/requireAuth.js")

const Movie = require("../models/movie")

router.use(requireAuth)

router.get("/", (req, res, next) => {
	res.render("movies/index.ejs")
	
})



/**REST**/
//show 
// router.get("/movie_.id", (req, res, next) => {
// 	res.render("movies/show.ejs")
	
// })


module.exports = router