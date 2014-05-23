// server.js 

	// set up
	var express = require('express');
	var app = express();
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
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
	
	var port = process.env.PORT || 3000;

	mongoose.connect(config.mongoose.db);

	mongoose.connection.db.dropDatabase();

	var TaskSchema = new Schema({
		text:{type:String},
		complete:{type:Boolean},
		priority:{type:Number}
	});

	var UserSchema = new Schema({
		name:{type:String,required:true,unique:true},
		tasks:[TaskSchema]
	});

	username = config.auth.username;
	password = config.auth.password;

	app.use(express.basicAuth(username, password));

	var User = mongoose.model('User',UserSchema);
	var Task = mongoose.model('Task',TaskSchema);

	app.configure(function(){
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
	});

	app.get('/api/users',function(req,res){
		User.find({},null,{sort:{_id:1}},function(err,users){
			if(err)
				console.log(err);

			res.json(users);
		});
	});

	app.get('/api/users/:id',function(req,res){
		User.findById(req.params.id,function(err,user){
			if(err)
				console.log(err);

			res.json(user);
		});
	});

	app.post('/api/users/:user_id/clearcomplete',function(req,res){
		topull = [];
		User.findById(req.params.user_id,function(err,user){
			for(var i=0;i<user.tasks.length;i++){
				if(user.tasks[i].complete){
					topull.push(user.tasks[i]._id);
				}
			}
			for(var i=0;i<topull.length;i++){
				user.tasks.pull({_id:topull[i]});
			}
			user.save();
			io.sockets.emit("task:update:user:"+req.params.user_id);
			res.json("Success");
		});
	});

	app.post('/api/users/:user_id/task/:task_id/complete',function(req,res){
		User.findById(req.params.user_id,function(err,user){
			for(var i=0;i<user.tasks.length;i++){
				if(user.tasks[i]._id == req.params.task_id){
					if(user.tasks[i].complete){
						user.tasks[i].complete = false;
					} else {
						user.tasks[i].complete = true;
						user.tasks[i].priority = 0;
					}
				}
			}
			user.save();
			res.json("Success");
			io.sockets.emit("task:update:user:"+req.params.user_id);
		});
	});

	app.post('/api/users',function(req,res){
		User.create({
			name:req.body.name
		}, function(err,user){
			io.sockets.emit("add:user",user);

			if(err)
				console.log(err);

			User.find(function(err,users){
				if(err)
					console.log(err);
				res.json(users);
			});
		});
	});

	app.get('/api/users/:id/tasks',function(req,res){
		User.findById(req.params.id,function(err,user){
			if(err)
				console.log(err);
			console.log(user.tasks);
			res.json(user.tasks);
		})
	})

	app.post('/api/users/:user_id',function(req,res){
		User.findById(req.params.user_id,function(err,user){
			var task = new Task;
			task.text = req.body.text;
			task.priority = 1;
			task.complete = 0;
			user.tasks.push(task);
			user.save();
			res.json(task);
			io.sockets.emit('task:update:user:'+user._id);
		});
	});

	app.delete('/api/users/:id/:index',function(req,res){
		io.sockets.emit("delete:user",req.params.index);
		User.remove({
			_id:req.params.id
		}, function(err,user){
			if(err)
				console.log(err);


			User.find(function(err,users){
				if(err)
					console.log(err);
				res.json(users);
			});
		});
	});

	app.post('/api/users/:user_id/task/:task_id/:dir',function(req,res){
		User.findById(req.params.user_id,function(err,user){
			for(var i=0;i<user.tasks.length;i++){
				if(user.tasks[i]._id == req.params.task_id){
					if(req.params.dir == 'up'){
						user.tasks[i].priority++;
					}
					if(req.params.dir == 'down'){
						user.tasks[i].priority--;
					}
				}
			}
			user.save();
			res.json("Success");
			io.sockets.emit("task:update:user:"+req.params.user_id);
		});
	});

	app.delete('/api/users/:user_id/task/:task_id',function(req,res){
		User.findById(req.params.user_id,function(err,user){
			user.tasks.pull({_id:req.params.task_id});
			user.save();
			res.json(user.tasks);
			io.sockets.emit('task:update:user:'+user._id);
		});
	});

	var io = require('socket.io').listen(app.listen(port));
	io.sockets.on('connection',function(socket){		
	});