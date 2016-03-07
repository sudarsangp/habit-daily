'use strict';

angular.module('codeApp')
	.service('DbHabitService', function ($http, $rootScope){
		this.getAllHabitsData = getAllHabitsData;
		this.createHabit = createHabit;
		this.getHabit = getHabit;
		this.updateHabit = updateHabit;
		this.deleteHabit = deleteHabit;
		this.runOnceHabit = runOnceHabit;
		this.habitNumbers = habitNumbers;
		this.lastWeekStreak = lastWeekStreak;
		this.signInUser = signInUser;
		this.numberForHabit = numberForHabit;
		
		function getAllHabitsData(){
			return $http.get('http://127.0.0.1:8000/habitdaily/api/v1.0/habits', {
				headers: {'Authorization':  $rootScope.token + ':'}
			});
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

		function numberForHabit(id){
			return $http.get('http://127.0.0.1:8000/number/' + id)
		}

		function lastWeekStreak(){
			return $http.get('http://127.0.0.1:8000/lastweek/');
		}

		function signInUser(userData){
			return $http.get('http://127.0.0.1:8000/api/token', {
		    headers: {'Authorization':  userData.username + ':' + userData.password}
			});
		}
	});