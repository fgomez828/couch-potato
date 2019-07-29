const mongoose = require("mongoose")

const Movie = new mongoose.model("Movie", mongoose.Schema({
	name: {
		type: String,
		required: true

	},
	date:{
		type:String
	},
	description: {
		type: String,
		required: true
	},
	image: {
		type: Buffer,
		data: String
	}
}))

module.exports = Movie;