'use strict';

/**
 * @ngdoc controller
 * @name codeApp.controller:MainCtrl
 * @description
 * to handle basic functionalities
 */
angular.module('codeApp')
  .controller('MainCtrl', function ($window) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    this.habits = [];
    this.disableAddButton = true;
    
    this.addHabit = addHabit;
    this.removeHabit = removeHabit;
    this.beginHabit = beginHabit;
    /** This is a function to add a habit */
    function addHabit(habitName) {
      if(habitName){
        var habit = {'name': habitName, 'streak': 0, 'status': 'not started'};
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
      this.habits[position].streak += 1;
    }
  });
