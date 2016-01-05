'use strict';

angular.module('codeApp')
	.service('DbHabitService', function ($http){
		this.getAllHabits = getAllHabits;

		function getAllHabits(){
			getAllHabitsData().then(function(response){
				console.log(response);
			});
		}

		function getAllHabitsData(){
			return $http.get('http://127.0.0.1:8000/habitdaily/api/v1.0/habits');
		}
	});