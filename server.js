// server.js 

	// set up
	var express = require('express');
	var app = express();
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	mongoose.connect('mongodb://moe:fluffybunny@ds047468.mongolab.com:47468/moedb');

	mongoose.connection.db.dropDatabase();

	var TaskSchema = new Schema({
		text:{type:String}
	});

	var UserSchema = new Schema({
		name:{type:String,required:true,unique:true},
		tasks:[TaskSchema]
	});

	var User = mongoose.model('User',UserSchema);
	var Task = mongoose.model('Task',TaskSchema);

	app.configure(function(){
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
	});

	app.get('/api/users',function(req,res){
		User.find(function(err,users){
			if(err)
				console.log(err);

			res.json(users);
		});
	});

	app.post('/api/users',function(req,res){
		User.create({
			name:req.body.name
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

	app.post('/api/users/:user_id',function(req,res){
		User.findById(req.params.user_id,function(err,user){
			var task = new Task;
			task.text = req.body.text;
			user.tasks.push(task);
			user.save();
			var response = {
				name:req.body.text,
				_id:user.tasks[user.tasks.length-1]._id
			}
			res.json(task);
		});
	});

	app.delete('/api/users/:id',function(req,res){
		console.log(req.params.id);
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

	app.delete('/api/users/:user_id/task/:task_id',function(req,res){
		User.findById(req.params.user_id,function(err,user){
			user.tasks.pull({_id:req.params.task_id});
			user.save();
			res.json(user.tasks);
		})
	});

	app.listen(process.env.PORT || 3000);
	console.log("App listening on port 3000");