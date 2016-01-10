'use strict';

angular.module('codeApp')
	.service('DbHabitService', function ($http){
		this.getAllHabitsData = getAllHabitsData;

		function getAllHabitsData(){
			return $http.get('http://127.0.0.1:8000/habitdaily/api/v1.0/habits', {timeout: 5000});
		}
	});