'use strict';

/**
 * @ngdoc function
 * @name codeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the codeApp
 */
angular.module('codeApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    this.habits = [];
    this.addHabit = addHabit;
    this.removeHabit = removeHabit;

    function addHabit(habitName) {
      if(habitName){
        this.habits.push(habitName);
      }
    }

    function removeHabit(position) {
      this.habits.splice(position, 1);
    }
  });
