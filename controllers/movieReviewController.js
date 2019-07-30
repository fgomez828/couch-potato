const express = require("express")
const router = express.Router()
const requireAuth = require("../lib/requireAuth.js")
const superagent = require('superagent')
const Movie = require("../models/movie")

router.use(requireAuth)

//show
 router.get('/', (req, res, next) => {
  // console.log(req.query.title)
  const url = 'http://www.omdbapi.com/?t='+ req.query.title + '&apikey='+ process.env.API_KEY
  console.log(url);
  //use superagent to request api data
  superagent
  .get(url)
  .end((error, response) => {
    if(error) next(error);
    else {
      console.dir(response) // <-- format of this response will vary WIDELY depending on the API you're working with
      console.dir(response.text); // <-- this appears to be the JSON we want
    
      const dataAsObj = JSON.parse(response.text)
     //  console.dir(dataAsObj)

     //  const title = dataAsObj.Title
     //  const year = dataAsObj.Year
     //  const genre = dataAsObj.Genre
	    // const poster = dataAsObj.Poster
	    // const plot = dataAsObj.Plot
     //  console.log(" movie show route");
      //res.redirect("movies/")
      
      res.render('movies/show.ejs', {
        title: dataAsObj.Title,
        year: dataAsObj.Year,
        genre: dataAsObj.Genre,
        poster: dataAsObj.Poster,
        plot: dataAsObj.Plot
      })
    }
  })
})

router.get("/feed", (req, res, next) => {
	res.render("reviews/feed.ejs")
})

router.get("/movieIndex", (req,res,next) => {
	res.render("movies/index.ejs")
})

router.get("/create", (req,res,next) => {
	res.render("reviews/new.ejs")
})

router.get("/edit", (req,res,next) => {
	res.render("reviews/edit.ejs")
})

router.get("/:id", ((req,res,next) => {
  res.render("movies/show.ejs")
}))




module.exports = router








