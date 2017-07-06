var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var gcm = require('node-gcm');

// Session Schema
var SessionSchema = mongoose.Schema({
	name: String,
	nameUrl: String,
	imgThumbnail: String,
	trip: String,
	startDate: Date,
	endDate: Date
});

var Session = module.exports = mongoose.model('Session', SessionSchema);

//Create Place
module.exports.createSession = function(newSession, callback){
	newSession.save(callback);
}

// Display All Trip
module.exports.showSession = function(callback){
	Session.find({}, callback);
}

// Display Selected Trip
module.exports.showSelectedSession = function(selectedSession, callback){
	Session.find({"nameUrl": selectedSession}, callback);
}