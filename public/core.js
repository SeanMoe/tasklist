(function(){
	var app = angular.module('ahpTasks', []);

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
		
	app.controller('TaskController',function($http){
		var socket = io.connect();
		this.task = {};
		var big = this;

		this.connect = function(user){
			socket.on('task:add:user:'+user._id,function(data){
				big.updateTasks(user);
			});
			socket.on('task:delete:user:'+user._id,function(data){
				big.updateTasks(user);
			});
		}

		this.updateTasks = function(user){
			$http.get('/api/users/'+user._id+'/tasks').
			success(function(tasks){
				user.tasks = tasks;
			}).
			error(function(error){
				console.log("Error "+error);
			});
		}

		this.addTask = function(user){
			var main = this;
			$http.post('/api/users/'+user._id,this.task).
			success(function(data){
				main.task={};
				console.log(data);
			}).
			error(function(data){
				console.log("Error"+data);
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

		$http.get('/api/users')
			.success(function(data){
				main.people = data;
			}).
			error(function(data){
				console.log("Error"+data);
			});

		this.refreshTasks = function(){
			$http.get('/api/users')
			.success(function(data){
				main.people = data;
			}).
			error(function(data){
				console.log("Error"+data);
			});
		}

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