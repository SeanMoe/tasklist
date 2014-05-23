(function(){
	var app = angular.module('ahpTasks', ['naturalSort']);

	app.controller("UserController",function($http){
		this.user={};
		this.addUser = function(main,user){
			var big = this;
			$http.post('/api/users',user)
			.success(function(data){
				big.user = {};
			}).
			error(function(data){
				console.log("Error" + data);
			});
		};
	});
		
	app.controller('MainController',function($http){
		var socket = io.connect();
		var main = this;

		socket.on('add:user',function(data){
			$http.get('/api/users/'+data._id).
			success(function(data){
				main.people.push(data);
			}).
			error(function(data){
				console.log("error "+data);
			});
		});

		socket.on('delete:user',function(data){
			main.people.splice(data,1);
		});

		$http.get('/api/users')
			.success(function(data){
				main.people = data;
			}).
			error(function(data){
				console.log("Error"+data);
			});

		this.addTask = function(user,task){
			user.newTask={'text':''};
			$http.post('/api/users/'+user._id,task).
			success(function(data){
				console.log(data);
			}).
			error(function(data){
				console.log("Error"+data);
			});
		};

		this.toggleComplete = function(user,task){
			$http.post('/api/users/'+user._id+'/task/'+task._id+'/complete').
			success(function(data){

			}).
			error(function(data){

			});
		};

		this.clearComplete = function(user){
			$http.post('/api/users/'+user._id+'/clearcomplete').
			success(function(data){
			}).
			error(function(data){
				
			});
		}

		this.taskConnect = function(user){
			user.newTask = {'text':''};
			socket.on('up:user'+user._id,function(data){
				main.updateTasks(user);
			});
			socket.on('down:user'+user._id,function(data){
				main.updateTasks(user);
			});
			socket.on('task:update:user:'+user._id,function(data){
				main.updateTasks(user);
			});
		};

		this.updateTasks = function(user){
			$http.get('/api/users/'+user._id+'/tasks').
			success(function(tasks){
				user.tasks = tasks;
			}).
			error(function(error){
				console.log("Error "+error);
			});
		}

		this.upTask = function(user,task){
			$http.post('/api/users/'+user._id+'/task/'+task._id+'/up').
			success(function(data){
			}).
			error(function(data){
			});
		};

		this.downTask = function(user,task){
			$http.post('/api/users/'+user._id+'/task/'+task._id+'/down').
			success(function(data){

			}).
			error(function(data){

			});
		};

		this.deleteUser = function(user, index){
			$http.delete('/api/users/'+user._id+'/'+index).
			success(function(data){
			}).
			error(function(data){
				console.log("Error "+data)
			});
		};

		this.deleteTask = function(user,task){
			$http.delete('/api/users/'+user._id+'/task/'+task._id).
				success(function(data){

				}).
				error(function(data){
					console.log("Error"+data);
				});
		};
	});

})();