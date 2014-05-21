(function(){
	var app = angular.module('ahpTasks', []);

	app.controller("UserController",function($http){
		this.user={};
		this.addUser = function(main,user){
			var big = this;
			$http.post('/api/users',user)
			.success(function(data){
				big.user = {};
				main.people = data;
			}).
			error(function(data){
				console.log("Error" + data);
			});
		};
	});
		
	app.controller('TaskController',function($http){
		this.task = {};
		this.addTask = function(user){
			var main = this;
			$http.post('/api/users/'+user._id,this.task).
			success(function(data){
				main.task={};
				console.log(data);
				user.tasks.push(data);
			}).
			error(function(data){
				console.log("Error"+data);
			});			
		};
	});
		
	app.controller('MainController',function($http){
		var main = this;
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
					user.tasks = data;
				}).
				error(function(data){
					console.log("Error"+data);
				});
		};
	});

})();