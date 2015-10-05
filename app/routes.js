/* routes.js */

var User = require('./models/user');
var Task = require('./models/task');
var port = process.env.PORT || 3000;

module.exports = function(app){

	var io = require('socket.io').listen(app.listen(port));
		io.sockets.on('connection',function(socket){		
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
			res.json(user.tasks);
		});
	});


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

	app.post('/api/users/:user_id/task/:task_id',function(req,res){
		User.findById(req.params.user_id,function(err,user){
			for(var i=0;i<user.tasks.length;i++){
				if(user.tasks[i]._id == req.params.task_id){
					user.tasks[i].text = req.body.newText;
				}
			}
			user.save();
			res.json("Success");
			io.sockets.emit("task:update:user:"+req.params.user_id);
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
};