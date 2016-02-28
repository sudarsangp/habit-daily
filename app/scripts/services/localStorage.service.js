'use strict';

angular.module('codeApp')
	.service('LocalStorageService', function(localStorageService){
		this.addHabit = addHabit;
		this.removeHabit = removeHabit;
		this.modifyHabit = modifyHabit;
		this.getHabits = getHabits;
		this.getAllHabitsData = getAllHabitsData;
		this.setAllHabitsData = setAllHabitsData;
		this.getTodayHabits = getTodayHabits;
		this.updateHabitWithServerData = updateHabitWithServerData;
		this.newDayModifyHabit = newDayModifyHabit;

		this.getHabitNumbers = getHabitNumbers;
		this.setHabitNumbers = setHabitNumbers;
		this.removeHabitNumbers = removeHabitNumbers;

		var habitsKey = 'dailyhabits';
		var habitNumbers = 'habitNumbers';

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
			currentHabitList[position].status[index] = statusToUnix(habit.status);
			currentHabitList[position].state[index] = habit.state;
			currentHabitList[position].current[index] = habit.current;
			localStorageService.set(habitsKey, currentHabitList);
		}

		function updateHabitWithServerData(habit){
			var currentHabitList = localStorageService.get(habitsKey);
			for(var i=0; i<currentHabitList.length; i++){
				if(currentHabitList[i].name === habit.name){
					currentHabitList[i].id = habit.id;
					currentHabitList[i].uri = habit.uri;	
				}
			}
			localStorageService.set(habitsKey, currentHabitList);
		}

		function getHabits(){
			return this.getTodayHabits(localStorageService.get(habitsKey));
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

		function getHabitNumbers(){
			return localStorageService.get(habitNumbers);
		}

		function setHabitNumbers(numbers){
			localStorageService.set(habitNumbers, numbers);
		}

		function removeHabitNumbers(position) {
			var currentHabitNumbers = localStorageService.get(habitNumbers);
			currentHabitNumbers.splice(position, 1);
			localStorageService.set(habitNumbers, currentHabitNumbers);
		}

		function formatHabitForStorage(habit){
			var formatHabit = {
        'name': habit.name,
        'streak': habit.streak,
        'created': moment(habit.created).unix(),
        'status': [statusToUnix(habit.status)],
        'state': [habit.state],
        'current': [habit.current],
        'id': habit.id
      };
      return formatHabit;
		}

		function statusToUnix(statusData){
			var status = {};
			if(typeof statusData.started !== 'undefined'){
				status.started = moment(statusData.started).unix();
			}
			if(typeof statusData.finished !== 'undefined'){
				status.finished = moment(statusData.finished).unix();
			}
			return status;
		}

		function newDayModifyHabit(habitId){
			var allHabits = localStorageService.get(habitsKey);
			var position = _.findIndex(allHabits, function(o) {return o.id === habitId;});
      allHabits[position].status.push({});
      allHabits[position].state.push(0);
      allHabits[position].current.push(0);
      localStorageService.set(habitsKey, allHabits);
		}
	});