const express = require("express")
const router = express.Router()
const requireAuth = require("../lib/requireAuth.js")
const superagent = require('superagent')
const Movie = require("../models/movie")
require('isomorphic-fetch')
require('es6-promise')

router.use(requireAuth)

//show
 router.get('/', (req, res, next) => {
  // console.log(req.query.title)
  const url = 'http://www.omdbapi.com/?t='+ req.query.title + '&apikey='+ process.env.API_KEY
  //console.log(url);
  //use superagent to request api data
  superagent
  .get(url)
  .end((error, response) => {
    if(error) next(error);
    else {
      // console.dir(response) // <-- format of this response will vary WIDELY depending on the API you're working with
      // console.dir(response.text); // <-- this appears to be the JSON we want
    
      const dataAsObj = JSON.parse(response.text)
    
      
      res.render('movies/show.ejs', {
        title: dataAsObj.Title,
        year: dataAsObj.Year,
        genre: dataAsObj.Genre,
        poster: dataAsObj.Poster,
        plot: dataAsObj.Plot,
        imdbID: dataAsObj.imdbID
      })
    }
  })
})

//home
router.get("/feed", (req, res, next) => {
	res.render("reviews/feed.ejs")
})

//show all movies
router.get("/movieIndex", (req,res,next) => {
	res.render("movies/index.ejs")
})

//new review
router.get("/:id/create", async (req,res,next) => {
	res.render("reviews/new.ejs", {
    imdbID: req.params.id
  })
})

//edit review
router.get("/edit", (req,res,next) => {
	res.render("reviews/edit.ejs")
})

//show single movie page
router.get("/:id", (req,res,next) => {
  //find all reviews with this movie's imdbID
  res.render("movies/show.ejs")
})

//post review to movie
router.post("/:id", async (req,res,next) => {
  //add movie to database when first review is created
  try {
    const url = await fetch('http://www.omdbapi.com/?i='+ req.params.id + '&apikey='+ process.env.API_KEY)
    // superagent
    // .get(url)
    // .end( async (error, response) => {
    //   if(error) next(error);
      // else {
        //console.dir(response) // <-- format of this response will vary WIDELY depending on the API you're working with
        //console.dir(response.text); // <-- this appears to be the JSON we want
      
        const dataAsObj = await url.json()
        console.log(dataAsObj.Genre);
        console.log( "about to create movie");
        const newMovie ={
          title: dataAsObj.Title, 
          year: dataAsObj.Year,
          genre: dataAsObj.Genre,
          poster: dataAsObj.Poster,
          plot: dataAsObj.Plot
        }
        const reviewedMovie = await Movie.create(
          newMovie
        )

        reviewedMovie.save()
      // }
    // }) 
    console.log("check mongodb") 


    //assign database id to review

    //assign user id to review
    //redirect to show page

  } catch(error) {
    next(error)
  }
})


module.exports = router








