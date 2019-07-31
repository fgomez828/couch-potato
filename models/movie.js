const mongoose = require("mongoose")

const Movie = new mongoose.model("Movie", mongoose.Schema({
	title: String,
	year: String,
	genre: String,
	plot: String,
	poster: String,
	imdbID: String
}))

module.exports = Movie
