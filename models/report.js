var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var gcm = require('node-gcm');

// Report Schema
var ReportSchema = mongoose.Schema({
	user: String,
	trip: String,
	answers: Array,
	score: Number,
	date: Date
});

var Report = module.exports = mongoose.model('Report', ReportSchema);

//Create Report
module.exports.createReport = function(newReport, callback){
	newReport.save(callback);
}

// Display All Report
module.exports.showReport = function(callback){
	Report.find({}, callback);
}

// Display Selected Report
module.exports.showSelectedReport = function(selectedUser, callback){
	Report.find({"user": selectedUser}, callback);
}