const express = require("express")
const router = express.Router()
const requireAuth = require("../lib/requireAuth.js")
const superagent = require('superagent')
const Movie = require("../models/movie")
const Review = require("../models/review")
require('isomorphic-fetch')
require('es6-promise')

router.use(requireAuth)

//show --- search results page
 router.get('/', (req, res, next) => {
  // console.log(req.query.title)
  const url = 'http://www.omdbapi.com/?apikey='+ process.env.API_KEY + '&t='+ req.query.title
  // console.log(url);
  //use superagent to request api data
  superagent
  .get(url)
  .end((error, response) => {
    if(error) next("../views/movies/404");
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
        imdbID: dataAsObj.imdbID,
        reviews: []
      })
    }
  })
})

//home
router.get("/feed", async (req, res, next) => {
	const allReviews = await Review.find().populate("userId").populate("movieId").sort("-timestamp")
	res.render("reviews/feed.ejs", {
		reviews: allReviews,
	})
})

//show all movies
router.get("/index", async (req,res,next) => {
	//find all movies in db
	const reviewedMovies = await Movie.find({})
	res.render("movies/index.ejs", {
		movies: reviewedMovies
	})
})

//new review
router.get("/:id/create", async (req,res,next) => {
	res.render("reviews/new.ejs", {
    imdbID: req.params.id
  })
})

//404 page
router.get("/404", (req,res,next) => {
  res.render("404.ejs")
})

//edit review
router.get("/edit", (req,res,next) => {
	res.render("reviews/edit.ejs")
})

//show single movie page -- assumes movie already reviewed
router.get("/:imdbID", async (req,res,next) => {
	//turn movie name to movie id
	//find all reviews with this movie's imdbID
	try {
		const foundMovie = await Movie.findOne({imdbID: req.params.imdbID})
		// console.log(foundMovie.title);
    //find all reviews
		const allReviews = await Review.find({imdbID: foundMovie.imdbID}).populate("userId").sort("-timestamp")


    //find average of ratings
		const allRatings = allReviews.map(review => review.rating)
    const ratingsTotal = allRatings.reduce((a, rating) => {
      return a += rating
    }, 0)
    const avgRating = ratingsTotal / allRatings.length
    // console.log(avgRating);
    // console.log(allRatings, " <-- allRatings");
    console.log(allReviews, " <-- allReviews");

		res.render("movies/show.ejs", {
	 		title: foundMovie.title,
	 		poster: foundMovie.poster,
	 		year: foundMovie.year,
	 		genre: foundMovie.genre,
	 		plot: foundMovie.plot,
	 		imdbID: foundMovie.imdbID,
	 		reviews: allReviews,
      avg: avgRating
		})
	} catch(err) {
		res.redirect("/movies/404")
	}
})

//post review to movie
router.post("/:imdbID", async (req,res,next) => {
  //add movie to database when first review is created
  try {
  	//if movie does not exist, create movie in db
  	const foundMovie = await Movie.findOne({imdbID: req.params.imdbID})
  	let reviewedMovie
  	if(!foundMovie) {
	    const url = await fetch('http://www.omdbapi.com/?i='+ req.params.imdbID + '&apikey='+ process.env.API_KEY)	      
        const dataAsObj = await url.json()
        console.log(dataAsObj);
        console.log( "about to create movie");
        const newMovie = {
        	title: dataAsObj.Title, 
        	year: dataAsObj.Year,
        	genre: dataAsObj.Genre,
        	poster: dataAsObj.Poster,
        	plot: dataAsObj.Plot,
        	imdbID: dataAsObj.imdbID
        }
        reviewedMovie = await Movie.create(newMovie)
	        // console.log("check mongodb") 
  	}
    //if movie is found, just relate review to movie and user:
    //create review
    // console.log(req.body.content, " <-- review body");
    // console.log(foundMovie, " <-- found movie");
    // console.log(newMovie, " < -- new movie");
    const review = {
    	content: req.body.content,
    	userId: req.session.userId,
    	imdbID: req.params.imdbID,
    	movieId: foundMovie ? foundMovie._id : reviewedMovie._id,
      rating: req.body.rating
    }
    console.log(review);
    const newReview = await Review.create(review)
    /// push into either foundMoive
    //redirect to show page
    // console.log("check mongo for new review");
    // console.log(newReview, " <-- new review");
    res.redirect("/movies/" + req.params.imdbID)

  } catch(error) {
      res.redirect("/movies/404")
  }
})


module.exports = router








