var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var gcm = require('node-gcm');

// User Schema
var SchoolsSchema = mongoose.Schema({
	school: {
		type: String,
	}
});

var Schools = module.exports = mongoose.model('Schools', SchoolsSchema);

//Create User
module.exports.createSchools = function(newSchools, callback){
	        newSchools.save(callback);
}