'use strict';

angular.module('codeApp')
	.service('LocalStorageService', function(localStorageService){
		this.addHabit = addHabit;
		this.removeHabit = removeHabit;
		this.modifyHabit = modifyHabit;
		this.getHabits = getHabits;
		this.getAllHabitsData = getAllHabitsData;
		this.setAllHabitsData = setAllHabitsData;
		
		var habitsKey = 'dailyhabits';

		function addHabit(habit){
			if(habit === null){
				return null;
			}
			var currentHabitList = localStorageService.get(habitsKey) || [];
			currentHabitList.push(formatHabitForStorage(habit));
			localStorageService.set(habitsKey, currentHabitList);
		}

		function removeHabit(position){
			var currentHabitList = localStorageService.get(habitsKey);
			currentHabitList.splice(position, 1);
			localStorageService.set(habitsKey, currentHabitList);
		}

		function modifyHabit(position, habit){
			var currentHabitList = localStorageService.get(habitsKey);
			var index = currentHabitList[position].status.length - 1;
			currentHabitList[position].name = habit.name;
			currentHabitList[position].streak = habit.streak;
			currentHabitList[position].status[index] = habit.status;
			currentHabitList[position].state[index] = habit.state;
			currentHabitList[position].current[index] = habit.current;
			localStorageService.set(habitsKey, currentHabitList);
		}

		function getHabits(){
			return getTodayHabits(localStorageService.get(habitsKey));
		}

		function getTodayHabits(habits){
			var todayHabits = [];
			if(habits === null){
				todayHabits = [];
			}
			else{
				for(var i=0; i<habits.length; i++){
					var singleHabit = {
						'name': habits[i].name,
		        'streak': habits[i].streak,
		        'created': habits[i].created,
		        'status': habits[i].status[habits[i].status.length - 1],
		        'state': habits[i].state[habits[i].state.length - 1],
		        'current': habits[i].state[habits[i].current.length - 1]
					};
					todayHabits.push(singleHabit);
				}
			}
			return todayHabits;
		}

		function getAllHabitsData(){
			return localStorageService.get(habitsKey);
		}

		function setAllHabitsData(allHabitsData){
			localStorageService.set(habitsKey, allHabitsData);
		}

		function formatHabitForStorage(habit){
			var formatHabit = {
        'name': habit.name,
        'streak': habit.streak,
        'created': habit.created,
        'status': [habit.status],
        'state': [habit.state],
        'current': [habit.current]
      };
      return formatHabit;
		}
	});