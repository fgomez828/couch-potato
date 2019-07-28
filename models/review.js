const mongoose = require("mongoose")

const Review = new mongoose.model("Review", mongoose.Schema({
	content: {
		type: String,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	rating: {
		type: Number,
		required: true
	}
}))

module.exports = Review