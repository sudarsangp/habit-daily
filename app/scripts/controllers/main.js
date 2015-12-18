'use strict';

/**
 * @ngdoc controller
 * @name codeApp.controller:MainCtrl
 * @description
 * to handle basic functionalities
 */
angular.module('codeApp')
  .controller('MainCtrl', function ($window, TimeService, LocalStorageService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    this.habitState = Object.freeze({
      CREATED: 0,
      STARTED: 1,
      FINISHED: 2
    });

    this.habits = initializeHabitsToday();
    this.disableAddButton = true;
    this.today = moment().local().format('dddd[,] Do MMMM YYYY');
    this.addHabit = addHabit;
    this.removeHabit = removeHabit;
    this.beginHabit = beginHabit;
    this.finishHabit = finishHabit;

    function addHabit(habitName) {
      if(habitName){
        var habit = {
          'name': habitName,
          'streak': 0,
          'status': [{'created': new Date()}],
          'state': [this.habitState.CREATED],
          'current': [0]
        };
        this.habitName = '';
        LocalStorageService.addHabit(habit);
        this.habits = addLastWeekStreak(LocalStorageService.getHabits());
      }
    }

    function removeHabit(position) {
      if($window.confirm('This action will delete this habit')){
        LocalStorageService.removeHabit(position);
        this.habits = addLastWeekStreak(LocalStorageService.getHabits());
      }
    }

    function beginHabit(position) {
      this.habits[position].status.started = new Date();
      this.habits[position].state = this.habitState.STARTED;
      LocalStorageService.modifyHabit(position, this.habits[position]);
    }

    function finishHabit(position) {
      this.habits[position].streak += 1;
      this.habits[position].state = this.habitState.FINISHED;
      this.habits[position].status.finished = new Date();
      this.habits[position].status.timeDifference = TimeService.formatTime(TimeService.calculateTimeDifference(
        this.habits[position].status.started,
        this.habits[position].status.finished));
      this.habits[position].current = 1;
      LocalStorageService.modifyHabit(position, this.habits[position]);
      this.habits[position].lastWeekStreak = lastWeekHabitStreak(this.habits[position]);
    }

    function initializeHabitsToday() {
      var habits = LocalStorageService.getAllHabitsData() || [];
      var today = moment().local();
      if(habits.length > 0){
        habits = TimeService.updateHabitDaily(habits, today);
      }
      LocalStorageService.setAllHabitsData(habits);
      var todayHabits = LocalStorageService.getHabits();
      todayHabits = addLastWeekStreak(todayHabits);
      return todayHabits;
    }

    function lastWeekHabitStreak(habit) {
      var habits = LocalStorageService.getAllHabitsData() || [];
      var streaksHabit = [];
      for(var i=0; i<habits.length; i++){
        if(habits[i].name === habit.name){
          streaksHabit = habits[i].current.slice(Math.max(habits[i].current.length - 7, 0));
        }
      }
      return streaksHabit;
    }

    function addLastWeekStreak(habits){
      for(var i=0; i<habits.length; i++){
        habits[i].lastWeekStreak = lastWeekHabitStreak(habits[i]);
      }
      return habits;
    }

    // function convertToLocalTime(habits){
    //   for(var i=0; i<habits.length; i++){
    //     if(typeof habits[i].status.created !== 'undefined'){
    //       habits[i].status.created = moment(habits[i].status.created).local();
    //     }
    //   }
    //   return habits;
    // }

    // function convertToLocalTimeAll(allHabitsData){
    //   for(var i=0; i<allHabitsData.length; i++){
    //     for(var j=0; j<allHabitsData[i].status[j].length; j++){
    //       if(typeof allHabitsData[i].status[j].created !== 'undefined'){
    //         allHabitsData[i].status[j].created = moment(allHabitsData[i].status[j].created).local();
    //       }
    //     }
    //   }
    //   return allHabitsData;
    // }
  });
