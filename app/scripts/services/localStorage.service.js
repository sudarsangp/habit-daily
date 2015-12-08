'use strict';

angular.module('codeApp')
	.service('LocalStorageService', function(localStorageService){
		this.addHabit = addHabit;
		this.removeHabit = removeHabit;
		this.modifyHabit = modifyHabit;
		this.getHabits = getHabits;

		var habitsKey = 'dailyhabits';

		function addHabit(habit){
			var currentHabitList = localStorageService.get(habitsKey) || [];
			currentHabitList.push(habit);
			localStorageService.set(habitsKey, currentHabitList);
		}

		function removeHabit(position){
			var currentHabitList = localStorageService.get(habitsKey);
			currentHabitList.splice(position, 1);
			localStorageService.set(habitsKey, currentHabitList);
		}

		function modifyHabit(position, habit){
			var currentHabitList = localStorageService.get(habitsKey);
			currentHabitList[position] = habit;
			localStorageService.set(habitsKey, currentHabitList);
		}

		function getHabits(){
			return localStorageService.get(habitsKey) || [];
		}
	});