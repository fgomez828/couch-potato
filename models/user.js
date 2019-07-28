const mongoose = require("mongoose")

const User = new mongoose.model("User", mongoose.Schema({
	name: {
		type: String,
		required: true

	},
	password: {
		type: String,
		required: true
	},
	avatar: {
		type: Buffer,
		data: String
	}
}))

module.exports = User;