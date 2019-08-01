const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const Movie = require("../models/movie")
const Review = require("../models/review")
const User = require("../models/user")

router.post('/register.ejs', upload.single('photo'), (req, res, next) => {
  console.log("here is req.file: ");
  console.log(req.file);
  res.send('check terminal')
})

router.get('/register.ejs', (req,res,next) => {
	console.log(req.file);
})

//index
router.get("/", (req, res, next) => {
	res.render("users/login.ejs", {
		message: req.session.message
	})
})

/**AUTHENTICATION**/
//login
router.post("/login", async (req, res, next) => {
	try {
		const existingUser = await User.findOne({name: req.body.name})
		//check password
		if(bcrypt.compareSync(req.body.password, existingUser.password)) {
			//set session
			req.session.user = existingUser
			req.session.userId = existingUser._id
			req.session.username = existingUser.name
			req.session.loggedIn = true

			res.redirect("/movies/feed")

		} else {
			req.session.message = "Wrong Password"
			res.redirect("/user")
		}
	} catch(err) {
		next(err)
	}
})

//register
router.get("/register", (req, res, next) => {
	res.render("users/register.ejs", {
		message: req.session.message
	})
})

//new
router.post("/new", async (req, res, next) => {
	try {
		const duplicateUser = await User.findOne({name: req.body.name})
		if(!duplicateUser) {
			//secure password
			const password = req.body.password
			const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
			req.body.password = hashedPassword
			//create user
			const newUser = await User.create(req.body)
			//set session
			req.session.user = newUser
			req.session.userId = newUser._id
			req.session.username = newUser.name
			req.session.loggedIn = true
			// redirect

			res.redirect("/movies/feed")

		} else {
			req.session.message = "That username already exists. Try another one."
			res.redirect("/user/register")
		}
	} catch(err) {
		next(err)
	}
})

//logout
router.get("/logout", (req, res, next) => {
	req.session.destroy((err) => {
		if(err) next(err);
		else res.redirect("/user")
	})
})


/**REST**/
// show
router.get("/:id", async (req, res, next) => {
	const foundReviews = await Review.find({userId: req.params.id}).populate("movieId").sort("-timestamp")
	console.log(foundReviews, "<--- foundReviews");
	res.render("users/show.ejs", {
		message: req.session.message,
		reviews: foundReviews
	})
})

//edit -- to edit own profile
router.get("/:id/edit", (req, res, next) => {
	res.render("users/edit.ejs", {
		message: req.session.message
	})
})

//update -- to update own profile
router.put("/:id", async (req, res, next) => {
	// console.log("update route working")
	try {
		//if password to confirm changes matches user password, allow changes
		if(bcrypt.compareSync(req.body.password, req.session.user.password)) {
		const updatedUser = await User.findById(req.params.id)
			//if entered username is different than current username...
			if(req.body.newName !== req.session.user.name) {
				const duplicateUsername = await User.findOne({name: req.body.newName})
				//...and if entered username is not a duplicate, change username
				if(!duplicateUsername) {
					console.log(req.session.user, " <-- user before name change");
					updatedUser.name = req.body.newName
					req.session.user = updatedUser
					// console.log(updatedUser, " <-- updatedUser");
					console.log(req.session.user, " <-- user after name change");
				} else {
					req.session.message = "Username taken"
				}
			}
			//change password
			if (!bcrypt.compareSync(req.body.newPassword, req.session.user.password) && req.body.newPassword !== "") {
				const newPassword = bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10))
				console.log(updatedUser, " <-- updated user prior to pw change");
				updatedUser.password = newPassword
				console.log(updatedUser, " <-- updated user after pw change");
			}
			// 
			//replace avatar
			
			// console.log("password matches!");
			req.session.message = "Profile updated!"
			res.redirect("/user/" + req.session.user._id)
			//save all changes to db
			updatedUser.save()
		//if password to confirm changes does not match, do not change
			
		} else {
			// console.log("password does not match");
			req.session.message = "Wrong password - could not update profile"
			res.redirect("/user/" + req.session.user._id)
		}
	} catch(err) {
		next(err)
	}
})

//delete -- to delete own account
router.delete("/:id", async (req, res, next) => {
	try {
		const thisUser = await User.findByIdAndDelete(req.params.id)
		const userReviews = await Review.deleteMany({userId: thisUser._id})
		res.redirect("/user/register")
	} catch(err) {
		next(err)
	}
})

module.exports = router


