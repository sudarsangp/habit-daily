'use strict';

angular.module('codeApp')
	.service('DbHabitService', function ($http){
		this.getAllHabitsData = getAllHabitsData;
		this.createHabit = createHabit;
		this.getHabit = getHabit;
		this.updateHabit = updateHabit;
		this.deleteHabit = deleteHabit;
		this.runOnceHabit = runOnceHabit;
		this.habitNumbers = habitNumbers;
		this.lastWeekStreak = lastWeekStreak;
		this.signInUser = signInUser;

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
			$http.get('http://127.0.0.1:8000/update/' + id);
		}

		function habitNumbers(){
			return $http.get('http://127.0.0.1:8000/number/');
		}

		function lastWeekStreak(){
			return $http.get('http://127.0.0.1:8000/lastweek/');
		}

		function signInUser(){
			return $http.get('http://127.0.0.1:8000/api/token', {
		    headers: {'Authorization': ' "eyJhbGciOiJIUzI1NiIsImV4cCI6MTQ1NTk4MzI0MiwiaWF0IjoxNDU1OTgyNjQyfQ.eyJuYW1lIjoibWlndWVsIn0.sHvcpzRRaAr8L94L6I6VUrDky2ltdzsjgDZ-FJqUJlA'}
			});
		}
	});