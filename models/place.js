var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var gcm = require('node-gcm');

// Place Schema
var PlaceSchema = mongoose.Schema({
	name: String,
	nameUrl: String,
	imgThumbnail: String,
	imgPlace: String,
	imgMap: String,
	overview: String,
	markers: [
		{	
			name: String,
			nameScene: String,
			imgScene: String,
			x: Number,
			y: Number,
			r: Number,
			hint: Array
			// objectScene: [{ name: String, x: Number, y: Number, z: Number}]
		}
	]
});

var Place = module.exports = mongoose.model('Place', PlaceSchema);

// Create Place
module.exports.createPlace = function(newPlace, callback){
	newPlace.save(callback);
}

// Add Markers to Place
module.exports.addMarker = function(place, markers, callback){
	Place.update({"nameUrl": place}, {$set:{"markers": markers}}, callback);
}

// Display All Place
module.exports.showPlace = function(callback){
	Place.find({}, callback);
}

// Display Selected Place
module.exports.showSelectedPlace = function(selectedPlace, callback){
	Place.find({"nameUrl": selectedPlace}, callback);
}

// Display All Marker
module.exports.showMarker = function(callback){
	Place.find({}, callback);
}