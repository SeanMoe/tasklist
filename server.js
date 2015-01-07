// server.js 

	// set up
	var express = require('express');
	var app = express();
	var mongoose = require('mongoose');
	var port = process.env.PORT || 3000;
	if(process.env.node_env != 'production'){
		var config = require('./config')
	} else {
		config = {}
		config.mongoose = {};
		config.auth = {};
		config.mongoose.db = process.env.db;
		config.auth.username = process.env.username;
		config.auth.password = process.env.password;
	}		
 
	//DB Connection
	mongoose.connect(config.mongoose.db);

	// Basic Auth
	var username = config.auth.username;
	var password = config.auth.password;
	app.use(express.basicAuth(username, password));

	//Configuration
	app.configure(function(){
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
	});

	//Routes via routes.js
	require('./app/routes.js')(app)