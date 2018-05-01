
var app = angular.module('todoApp', ['ngResource', 'ui.bootstrap']);

app.service('UtilService', function($http) {
	this.extractResponseBody = function(res) {
		return res.data;
	};
});

app.service('todoApiService', function($http, UtilService) {	
	var protocolPrefix = window.config.api.protocolPrefix;
	var baseUrl = protocolPrefix + '://' + window.config.api.url;
	var apiPath = '/api/todos';
	var apiUrl = `${ baseUrl }${ apiPath }`; 

	this.createTodo = function(todo) {
		return $http.post(apiUrl, todo)
		.then(UtilService.extractResponseBody);
	}

	this.getTodos = function() {
		return $http.get(apiUrl)
		.then(UtilService.extractResponseBody);
	}

	this.updateTodo = function(id, todo) {
		return $http.put(`${ apiUrl }/${ id }`, todo)
		.then(UtilService.extractResponseBody);
	}

	this.deleteTodo = function(id) {
		return $http.delete(`${ apiUrl }/${ id }`)
		.then(UtilService.extractResponseBody);
	}

	return this;
});

app.controller("TodoAppCtrl", ['$scope','$http', '$modal', 'todoApiService', 
	function($scope, $http, $modal, todoApiService) {
		$scope.todos = [];

		$scope.mode = 'view';

		todoApiService.getTodos().then(function(todos) {
			$scope.todos = todos;
		}, function(err) {
			console.error(`Error getting todos ${ err.toString() }`);
		});

		$scope.createTodo = function() {
			console.info('create todo')
			$scope.mode = 'create';
		}

		$scope.updateTodo = function() {
			console.info('update todo')
		}

		$scope.deleteTodo = function() {
			console.info('delete todo')
		}
	}]);


