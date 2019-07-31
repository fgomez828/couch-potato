const mongoose = require("mongoose")

const Review = mongoose.model("Review", new mongoose.Schema({
	content: {
		type: String,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	imdbID: String, // imdb
	movieId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Movie"
	},
	rating: {
		type: Number,
		// required: true
	}
}))

module.exports = Review