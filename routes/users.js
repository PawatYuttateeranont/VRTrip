var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var gcm = require('node-gcm');
var multer = require('multer');

var User = require('../models/user');
var Schools = require('../models/schools');
var Place = require('../models/place');
var Question = require('../models/question');
var Trip = require('../models/trip');
var Report = require('../models/report');
var Session = require('../models/session');

// Prepare for Upload
var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './public/img');
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    }
});

var upload = multer({storage: storage}).any();

//////////////////////////////////////////////////////////////////////////////////////////////////
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Schools
router.get('/schools', function(req, res){
	res.render('schools');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Explore (Place & Trip)
router.get('/explore', ensureAuthenticated, function(req, res){
	res.render('explore');
});

// Session
router.get('/session', ensureAuthenticated, function(req, res){
	res.render('session');
});

// Place
router.get('/place', ensureAuthenticated, function(req, res){
	res.render('place');
});

// Display Overview Selected Trip
router.get('/place/overview/:selectedPlace', ensureAuthenticated, function(req, res){
	var selectedPlace = req.params.selectedPlace;
	res.render('overviewPlace', {placeUrl: selectedPlace});
});

// Selected Place
router.get('/place/:selectedPlace', ensureAuthenticated, function(req, res){
	var selectedPlace = req.params.selectedPlace;
	res.render('mapPlace', {placeUrl: selectedPlace});
});

// Trip
router.get('/trip', ensureAuthenticated, function(req, res){
	res.render('trip');
});

// Score All
router.get('/scoreAll', ensureAuthenticated, function(req, res){
	res.render('scoreAll');
});

// Display Overview Selected Trip
router.get('/trip/overview/:selectedTrip', ensureAuthenticated, function(req, res){
	var selectedTrip = req.params.selectedTrip;
	res.render('overviewTrip', {tripUrl: selectedTrip});
});

// Display Selected Trip
router.get('/trip/:selectedTrip', ensureAuthenticated, function(req, res){
	var selectedTrip = req.params.selectedTrip;
	res.render('mapTrip', {tripUrl: selectedTrip});
});

// Display Selected Photo
router.get('/photo/:selectedUser', ensureAuthenticated, function(req, res){
	var selectedUser = req.params.selectedUser;
	res.render('cameraRoll', {username: selectedUser});
});

// Display Score
router.get('/score/:selectedUser', ensureAuthenticated, function(req, res){
	var selectedUser = req.user.username;
	res.render('score', {username: selectedUser});
});

// Profile
router.get('/profile', ensureAuthenticated, function(req, res){
	var score = req.user.score;
	// res.render('profile', {username: req.user.name, email: req.user.email, registrationId: req.user.registrationId, score: req.user.score});
	res.render('profile');
});

//Google Map
router.get('/googleMap', ensureAuthenticated, function(req, res){
	res.render('googleMap');
});

//////////////////////////////////////////////////////////////////////////
// QUERY AND SHOW DATA
// DATA All Place 
router.get('/data/place', ensureAuthenticated, function(req, res){
	Place.showPlace(function(err, data){
		if(err) throw err;
		res.json(data);
	});
});

// DATA All Trip
router.get('/data/trip', ensureAuthenticated, function(req, res){
	Trip.showTrip(function(err, data){
		if(err) throw err;
		res.json(data);
	});
});

// DATA All Session
router.get('/data/session', ensureAuthenticated, function(req, res){
	Session.showSession(function(err, data){
		if(err) throw err;
		res.json(data);
	});
});

// DATA All Report
router.get('/data/report', ensureAuthenticated, function(req, res){
	Report.showReport(function(err, data){
		if(err) throw err;
		res.json(data);
	});
});

// Data Selected Place
router.get('/data/place/:selectedPlace', ensureAuthenticated, function(req, res){
	var selectedPlace = req.params.selectedPlace;
	//Query Place that User Click // name as SelectedPlace
	Place.showSelectedPlace(selectedPlace, function(err, data){
		if(err) throw err;
		res.json(data);
	});
});

// Data Selected Trip
router.get('/data/trip/:selectedTrip', ensureAuthenticated, function(req, res){
	var selectedTrip = req.params.selectedTrip;
	//Query Trip that User Click // name as SelectedTrip
	Trip.showSelectedTrip(selectedTrip, function(err, data){
		if(err) throw err;
		res.json(data);
	});
});

// Data Selected Report
router.get('/data/report/:selectedUser', ensureAuthenticated, function(req, res){
	var selectedUser = req.params.selectedUser;
	//Query Trip that User Click // name as SelectedTrip
	Report.showSelectedReport(selectedUser, function(err, data){
		if(err) throw err;
		res.json(data);
	});
});

// Data Selected Photo
router.get('/data/photo/:selectedUser', ensureAuthenticated, function(req, res){
	var selectedUser = req.params.selectedUser;
	//Query Trip that User Click // name as SelectedTrip
	User.showSelectedPhoto(selectedUser, function(err, data){
		if(err) throw err;
		res.json(data);
	});
});

//Question Data
router.get('/question_data', ensureAuthenticated, function(req, res){
	Question.showQuestion(function(err, data){
		if(err) throw err;
		res.json(data);
	});
});

//Marker Data
router.get('/marker_data', ensureAuthenticated, function(req, res){
	Place.showMarker(function(err, data){
		if(err) throw err;
		res.json(data);
	});
});
//////////////////////////////////////////////////////////////////////////

// Add Question
router.get('/addQuestion', ensureAuthenticated, function(req, res){
	res.render('addQuestion');
});

// Question
router.get('/question', ensureAuthenticated, function(req, res){
	res.render('question');
});

// Add Place
router.get('/addPlace', ensureAuthenticated, function(req, res){
	res.render('addPlace');
});

// Add Marker
router.get('/addMarker', ensureAuthenticated, function(req, res){
	res.render('addMarker');
});

// Add Marker
router.get('/addMarker/:place', ensureAuthenticated, function(req, res){
	var place = req.params.place;
	res.render('addMarker', {placeUrl:place});
});

// Add Scene
router.get('/addScene/:place', ensureAuthenticated, function(req, res){
	var place = req.params.place;
	res.render('addScene', {placeUrl:place});
});

// Add Trip
router.get('/addTrip', ensureAuthenticated, function(req, res){
	res.render('addTrip');
});

// Add Session
router.get('/addSession', ensureAuthenticated, function(req, res){
	res.render('addSession');
});

// Add Upload
router.get('/addupload', ensureAuthenticated, function(req, res){
	res.render('addUpload');
});


///////////////////////////////////////////////////////////////////////////////////////////////////
//POST

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var role = req.body.role;
	console.log(role);

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password,
			role: role,
			registrationId : ""
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

// Schools
router.post('/schools', function(req, res){
	var schools = req.body.schools;

	// Validation
	req.checkBody('schools', 'Schools is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newSchools = new Schools({
			schools: schools,
		});

		Schools.createSchools(newSchools, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

//Send Message
router.post('/send', function(req, res){
	var scene = req.body.scene;
	var sceneImg = req.body.sceneImg;
	var registrationId = req.user.registrationId;

	User.openScene(scene, sceneImg,registrationId,function(result){
		res.json(result);
	});

	console.log('SEND SUCCESS! (routes)');
	console.log('SCENE FROM ROUTES : ' + scene);
	console.log('REGISTRATION_ID : ' + registrationId);
	req.flash('success_msg', 'Exploring! ' + scene);
	// res.redirect('back');
});


//Upload File Basic
router.post('/upload', function(req, res) {
  	upload(req, res, function(err) {
  		if(err) {
    		console.log('Error Occured');
    		return;
  		}
  		console.log(req.file);
  		console.log('Uploaded');
  		console.log('____________________');
  	})
});

//Add Report
router.post('/addReport', function(req, res){
	var trip = req.body.tripUrl;
	var answers = req.body.answers;
	var user = req.user.username;
	var score = req.body.score;
	var date = Date();

	var newReport = new Report({
			user: user,
			trip: trip,
			answers: answers,
			score: score,
			date: date
	});

	Report.createReport(newReport, function(err, user){
		if(err) throw err;
	});

	console.log('ADD REPORT SUCCESS! (routes)');
	// res.redirect('done');
});

// POST Add Place
router.post('/addPlace', function(req, res){
	var name = req.body.name;
	var nameUrl = req.body.nameUrl;
	var overview = req.body.overview;
	var imgThumbnail = req.body.imgThumbnail;
	var imgPlace = req.body.imgPlace;
	var imgMap = req.body.imgMap;
	var markers = [];

	// Add to Database Section
	var newPlace = new Place({
		name: name,
		nameUrl: nameUrl,
		overview: overview,
		imgThumbnail: imgThumbnail,
		imgPlace: imgPlace,
		imgMap: imgMap,
		markers: markers
	});

	if (name != null){
		Place.createPlace(newPlace, function(err, user){
			if(err) throw err;
			console.log(user);
		});
	}
	// res.redirect('addMarker/' + nameUrl);
});

// POST Add Marker
router.post('/addMarker', function(req, res){
	var elements = req.body.elements;
	var placeUrl = req.body.placeUrl;
	Place.addMarker(placeUrl, elements, function(err, user){
		if(err) throw err;
	});
	// req.flash('success_msg', 'Place and Markers Added');
});

// POST Add Trip // UNDERCONSTRUCTION!!!!
router.post('/addTrip', function(req, res){
	var name = req.body.name;
	var nameUrl = req.body.nameUrl;
	var imgThumbnail = req.body.imgThumbnail;
	var overview = req.body.overview;
	var place = req.body.place;
	var assignments = req.body.assignments;

	var newTrip = new Trip({
		name: name,
		nameUrl: nameUrl,
		imgThumbnail: imgThumbnail,
		overview: overview,
		place: place,
		assignments: assignments
	});
	if (name != null) {
		Trip.createTrip(newTrip, function(err, user){
			if(err) throw err;
			console.log(user);
		});
	}
	req.flash('success_msg', 'Trip Added');
	res.redirect('/users/addTrip');
});

// POST Add Session
router.post('/addSession', function(req, res){
	var name = req.body.name;
	var nameUrl = req.body.nameUrl;
	var imgThumbnail = req.body.imgThumbnail;
	var trip = req.body.trip;
	var startDate = req.body.startDate;
	var endDate = req.body.endDate;

	var newSession = new Session({
		name: name,
		nameUrl: nameUrl,
		imgThumbnail: imgThumbnail,
		trip: trip,
		startDate: startDate,
		endDate: endDate
	});
	if (name != null) {
		Session.createSession(newSession, function(err, user){
			if(err) throw err;
			console.log(user);
		});
	}
	req.flash('success_msg', 'Session Added');
	res.redirect('/users/addSession');
});

// POST Add Question
router.post('/addQuestion', function(req, res){
	var question = req.body.question;
	var options = req.body.options;
	var answer = req.body.answer;

	var newQuestion = new Question({
			question: question,
			options: options,
			answer: answer
	});

	Question.createQuestion(newQuestion, function(err, user){
		if(err) throw err;
		console.log(user);
	});

	req.flash('success_msg', 'Question Added');
	res.redirect('/users/addQuestion');
});

// POST question // to UPDATE Score to Database
router.post('/question', function(req, res) {
	var username = req.user.username;
	var score = parseInt(req.body.score);
	console.log(score);
	if(!isNaN(score)){
		User.updateScore(username, score);
	}
});

///////////////////////////////////////////////////////////////////////////////////////////////////
passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;