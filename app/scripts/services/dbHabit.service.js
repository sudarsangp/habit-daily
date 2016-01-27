'use strict';

angular.module('codeApp')
	.service('DbHabitService', function ($http){
		this.getAllHabitsData = getAllHabitsData;
		this.createHabit = createHabit;
		this.getHabit = getHabit;
		this.updateHabit = updateHabit;
		this.deleteHabit = deleteHabit;
		this.runOnceHabit = runOnceHabit;
		
		function getAllHabitsData(){
			return $http.get('http://127.0.0.1:8000/habitdaily/api/v1.0/habits', {timeout: 5000});
		}

		function createHabit(habitData){
			return $http.post('http://127.0.0.1:8000/habitdaily/api/v1.0/habits', habitData);
		}

		function updateHabit(habitData, uri){
			return $http.put('http://127.0.0.1:8000/habitdaily/api/v1.0/habits/' + uri, habitData);
		}

		function deleteHabit(uri){
			return $http.delete('http://127.0.0.1:8000/habitdaily/api/v1.0/habits/' + uri);
		}

		function getHabit(uri){
			return $http.get('http://127.0.0.1:8000/habitdaily/api/v1.0/habits/' + uri);
		}

		function runOnceHabit(id){
			$http.get('http://127.0.0.1:8000/update/' + id)
		}
	});