var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var gcm = require('node-gcm');

// Question Schema
var QuestionSchema = mongoose.Schema({
	question: {
		type: String
	},
	options: {
		type: Array
	},
	answer: {
		type: Number
	}
});

var Question = module.exports = mongoose.model('Question', QuestionSchema);

module.exports.createQuestion = function(newQuestion, callback){
	newQuestion.save(callback);
}

module.exports.showQuestion = function(callback){
	Question.find({}, callback);
}

