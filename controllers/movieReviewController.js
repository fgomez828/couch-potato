const express = require("express")
const router = express.Router()

const Movie = require("../models/movie")


router.get("/", (req, res, next) => {
	res.render("movies/index.ejs")
	
})



/**REST**/
//show 
// router.get("/movie_.id", (req, res, next) => {
// 	res.render("movies/show.ejs")
	
// })


module.exports = router