var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var gcm = require('node-gcm');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	role: {
		type: String
	},
	registrationId: {
		type: String
	},
	photos: {
		type: Array
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

//Create User
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

//Create User Non Encrypt
// module.exports.createUser = function(newUser, callback){
// 	 newUser.save(callback);
// }

//Get Username by Username
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

//Get Username by ID
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

//Compare Password
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

//Compare Password Non Encrypt
// module.exports.comparePassword = function(candidatePassword, password, callback){
// 	if (candidatePassword == password){
// 		callback(null, isMatch);
// 	} else {
// 		callback(null);
// 	}
// }

// Display Selected Photo
module.exports.showSelectedPhoto = function(selectedUser, callback){
	User.find({"username": selectedUser}, callback);
}

//Send Location
module.exports.openScene = function(scene, imgScene, registrationId, callback){
	var scene = new gcm.Message({data: {scene: scene, imgScene:imgScene}});
	var regTokens = [registrationId];
	var sender = new gcm.Sender('AIzaSyAgzcZwswJfes4jMVLyBQ6w3jmVhB-wM98');
	sender.send(scene, { registrationTokens: regTokens }, function (err, response) {
		if (err){
			console.error(err);
			console.log('__________________________________________________')
		} else 	{
			console.log(response);
			console.log('__________________________________________________')
		}
	});
}

//Update Score
module.exports.updateScore = function(username, score){
	var query = {username: username};
	var update = {$set: {score: score}};
	User.findOneAndUpdate(
		{username:username},
		{$set:{score:score}},
		{new: true},
		function(err, out){
			if(err){
        		console.log("UPDATE FAILED!");
    		}
    		console.log(out);
		}
	);
}

