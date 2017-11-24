'use strict';

exports.register = function(server, options, next) {
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/test');

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	  console.log('connected to db');
	  var companySchema = mongoose.Schema({
	    name: String,
	    description: String,
	    address: String,
	    country: String
	  });
	  var Company = mongoose.model('Company', companySchema);
	  server.app.db = {
	  	company: Company,
	  	text: "db"
	  }
	  next();
	});
}

exports.register.attributes = {
	pkg: require('./packaje.json')
}
