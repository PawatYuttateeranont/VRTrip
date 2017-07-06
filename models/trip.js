var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var gcm = require('node-gcm');

// Trip Schema
var TripSchema = mongoose.Schema({
	name: String,
	nameUrl: String,
	imgThumbnail: String,
	overview: String,
	place: String,
	assignments: Array
	// fills: [
	// 	{	
	// 		question: String, 
	// 		answer: String
	// 	}
	// ],
	// choices:[
	// 	{ 
	// 		question: String, 
	// 		options: Array, 
	// 		answer: Number
	// 	}
	// ]
});

var Trip = module.exports = mongoose.model('Trip', TripSchema);

//Create Place
module.exports.createTrip = function(newTrip, callback){
	newTrip.save(callback);
}

// Display All Trip
module.exports.showTrip = function(callback){
	Trip.find({}, callback);
}

// Display Selected Trip
module.exports.showSelectedTrip = function(selectedTrip, callback){
	Trip.find({"nameUrl": selectedTrip}, callback);
}