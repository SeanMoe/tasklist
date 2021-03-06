// server.js 

	// set up
	var express = require('express');
	var morgan         = require('morgan');
	var bodyParser     = require('body-parser');
	var methodOverride = require('method-override');
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
	//Remove basic auth for now
	//app.use(express.basicAuth(username, password));

	//Configuration
	app.use(express.static(__dirname + '/public'));
	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(methodOverride());

	//Routes via routes.js
	require('./app/routes.js')(app)