'use strict';

/**
 * @ngdoc controller
 * @name codeApp.controller:MainCtrl
 * @description
 * to handle basic functionalities
 */
angular.module('codeApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    this.habits = [];
    this.disableAddButton = true;
    
    this.addHabit = addHabit;
    this.removeHabit = removeHabit;

    /** This is a function to add a habit */
    function addHabit(habitName) {
      if(habitName){
        this.habits.push(habitName);
      }
    }

    /** This is a function to remove a habit */
    function removeHabit(position) {
      this.habits.splice(position, 1);
    }
  });
