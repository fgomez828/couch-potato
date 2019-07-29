const express = require("express")
const router = express.Router()
const requireAuth = require("../lib/requireAuth.js")
const superagent = require('superagent')
const Movie = require("../models/movie")

router.use(requireAuth)

router.get("/", (req, res, next) => {
	res.render("movies/index.ejs")
	
})




router.get('/', (req, res, next) => {

    const url = 'http://www.omdbapi.com/?t='+ mean+girls + '&apikey='+ process.env.API_KEY
    console.log(url);


    superagent
    .get(url)
    .end((error, response) => {
      if(error) next(error);
      else {
        // console.dir(response) // <-- format of this response will vary WIDELY depending on the API you're working with
        // console.dir(response.text); // <-- this appears to be the JSON we want
        // so we must JSON.parse it
        const dataAsObj = JSON.parse(response.text)
        console.dir(dataAsObj)

        // we could crunch data here or in template or both
        const name = dataAsObj.main.Title
        const date = dataAsObj.Released
        const description = dataAsObj.Genre

        res.render('weather/show.ejs', {
          zip: zip,
          temp: temp,
          weatherStr: weatherStr,
          location: location
        })
      }
    })

	res.render('movies/show.ejs', {
          name: name,
          date: date,
          description: decription,
          //image: image
        })
})








module.exports = router