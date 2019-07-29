module.exports = (req, res, next) => {
	if(!req.session.loggedIn) {
		req.session.message = "Please log in to access reviews."
		res.redirect("/user")
	} else {
		next()
	}
}