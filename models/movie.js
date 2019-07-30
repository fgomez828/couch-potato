const mongoose = require("mongoose")

const Movie = new mongoose.model("Movie", mongoose.Schema({
	title: {
		type: String,
		required: true

	},
	year:{
		type:String
	},
	genre: {
		type: String,
		required: true
	},
	poster: {
		type: String,
	},
	plot: {
		type: String
	}
}))

module.exports = Movie;