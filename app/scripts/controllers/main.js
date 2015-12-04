'use strict';

/**
 * @ngdoc controller
 * @name codeApp.controller:MainCtrl
 * @description
 * to handle basic functionalities
 */
angular.module('codeApp')
  .controller('MainCtrl', function ($window, TimeService) {
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

    this.habits = [];
    this.disableAddButton = true;
    
    this.addHabit = addHabit;
    this.removeHabit = removeHabit;
    this.beginHabit = beginHabit;
    this.finishHabit = finishHabit;

    /** This is a function to add a habit */
    function addHabit(habitName) {
      if(habitName){
        var habit = {
          'name': habitName,
          'streak': 0,
          'status': {'created': new Date()},
          'state': this.habitState.CREATED
        };
        this.habits.push(habit);
        this.habitName = '';
      }
    }

    /** This is a function to remove a habit */
    function removeHabit(position) {
      if($window.confirm('This action will delete this habit')){
        this.habits.splice(position, 1);
      }
    }

    function beginHabit(position) {
      this.habits[position].status.started = new Date();
      this.habits[position].state = this.habitState.STARTED;
    }

    function finishHabit(position) {
      this.habits[position].streak += 1;
      this.habits[position].state = this.habitState.FINISHED;
      this.habits[position].status.finished = new Date();
      this.habits[position].status.timeDifference = TimeService.formatTime(TimeService.calculateTimeDifference(
        this.habits[position].status.started,
        this.habits[position].status.finished));
    }

  });
