'use strict';

/**
 * @ngdoc controller
 * @name codeApp.controller:MainCtrl
 * @description
 * to handle basic functionalities
 */
angular.module('codeApp')
  .controller('MainCtrl', function ($scope, $window, TimeService, LocalStorageService, $mdToast, $uibModal, DbHabitService, Habit) {
    var habitApp = this;

    habitApp.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    habitApp.habitState = Object.freeze({
      CREATED: 0,
      STARTED: 1,
      FINISHED: 2
    });
    habitApp.defaultToastPosition = 'top right';
    habitApp.defaultToastDisplayTime = 3000;
    habitApp.showPencil = false;
    habitApp.disableAddButton = true;
    habitApp.today = moment().local().format('dddd[,] Do MMMM YYYY');
    habitApp.addHabit = addHabit;
    habitApp.removeHabit = removeHabit;
    habitApp.beginHabit = beginHabit;
    habitApp.finishHabit = finishHabit;
    habitApp.openAddHabitModal = openAddHabitModal;

    habitApp.toolTipTodayText = toolTipTodayText;
    habitApp.toolTipStreakText = toolTipStreakText;
    habitApp.toolTipLastWeekText = toolTipLastWeekText;

    $scope.$watch('online', function(newValue, oldValue){
      if(newValue !== oldValue){
        var habits;
        var today = moment().local();
        var todayHabits;
        if(newValue){
          DbHabitService.getAllHabitsData().then(function (response){
            habits = response.data.habits || [];
            if(habits.length > 0){
              habits = TimeService.updateHabitDaily(habits, today);
            }
            todayHabits = LocalStorageService.getTodayHabits(habits);
            todayHabits = addLastWeekStreak(todayHabits);
            habitApp.habits = todayHabits;
          });
        }
        else {
          habits = LocalStorageService.getAllHabitsData() || [];  
          if(habits.length > 0){
            habits = TimeService.updateHabitDaily(habits, today);
          }
          LocalStorageService.setAllHabitsData(habits);
          todayHabits = LocalStorageService.getHabits();
          todayHabits = addLastWeekStreak(todayHabits);
          habitApp.habits = todayHabits;
        }
      }
    });

    function addHabit(habitName) {
      if(habitName){
        var habit = new Habit();
        habit.name = habitName;
        habitApp.habitName = '';

        DbHabitService.createHabit(habit.requestBody()).then(function(response){
          if(!response){
            LocalStorageService.addHabit(habit);
          } else {
            habit = Habit.build(response.data.habit);
          }
          $mdToast.show(
            $mdToast.simple()
              .textContent('created \"' + habit.name + '\" habit')
              .position(habitApp.defaultToastPosition)
              .hideDelay(habitApp.defaultToastDisplayTime)
          );
          habit.lastWeekStreak = lastWeekHabitStreak(habit);
          habitApp.habits.push(habit);
        });

      }
    }

    function removeHabit(position) {
      if($window.confirm('habitApp action will delete habitApp habit')){

        DbHabitService.deleteHabit(habitApp.habits[position].id).then(function(response){
          if(!response){
            LocalStorageService.removeHabit(position);
          }
          $mdToast.show(
            $mdToast.simple()
              .textContent('deleted \"' + habitApp.habits[position].name + '\" habit')
              .position(habitApp.defaultToastPosition)
              .hideDelay(habitApp.defaultToastDisplayTime)
          );
           habitApp.habits.splice(position, 1);
        });

      }
    }

    function beginHabit(position) {
      habitApp.habits[position].status.started = new Date();
      habitApp.habits[position].state = habitApp.habitState.STARTED;

      DbHabitService.updateHabit(habitApp.habits[position].requestBody(), habitApp.habits[position].id).then(function (response){
        if(!response){
          LocalStorageService.modifyHabit(position, habitApp.habits[position]);
        }
        $mdToast.show(
          $mdToast.simple()
            .textContent('congrats on starting \"' + habitApp.habits[position].name + '\" habit')
            .position(habitApp.defaultToastPosition)
            .hideDelay(habitApp.defaultToastDisplayTime)
        );
      });

    }

    function finishHabit(position) {
      habitApp.habits[position].streak += 1;
      habitApp.habits[position].state = habitApp.habitState.FINISHED;
      habitApp.habits[position].status.finished = new Date();
      habitApp.habits[position].status.timeDifference = TimeService.formatTime(TimeService.calculateTimeDifference(
        habitApp.habits[position].status.started,
        habitApp.habits[position].status.finished));
      habitApp.habits[position].current = 1;

        DbHabitService.updateHabit(habitApp.habits[position].requestBody(), habitApp.habits[position].id).then(function (response){
          if(!response){
            LocalStorageService.modifyHabit(position, habitApp.habits[position]);
          }
          $mdToast.show(
            $mdToast.simple()
              .textContent('congrats on finishing \"' + habitApp.habits[position].name + '\" habit')
              .position(habitApp.defaultToastPosition)
              .hideDelay(habitApp.defaultToastDisplayTime)
          );
        });

      habitApp.habits[position].lastWeekStreak = lastWeekHabitStreak(habitApp.habits[position]);
    }

    function initializeHabitsToday() {
      var habits;
      var today = moment().local();
      var todayHabits;
      
      if(!$window.navigator.onLine) {
        habits = LocalStorageService.getAllHabitsData() || [];  
        if(habits.length > 0){
          habits = TimeService.updateHabitDaily(habits, today);
        }
        LocalStorageService.setAllHabitsData(habits);
        todayHabits = LocalStorageService.getHabits();
        todayHabits = addLastWeekStreak(todayHabits);
        habitApp.habits = todayHabits;
      } 
      else {
        DbHabitService.getAllHabitsData().then(function (response){
          if(!response){
            habits = LocalStorageService.getAllHabitsData() || [];  
            if(habits.length > 0){
              habits = TimeService.updateHabitDaily(habits, today);
            }
            LocalStorageService.setAllHabitsData(habits);
            todayHabits = LocalStorageService.getHabits();
            todayHabits = addLastWeekStreak(todayHabits);
            habitApp.habits = todayHabits;
          } else {
            habits = response.data.habits || [];
            habitApp.habits = [];
            
            DbHabitService.habitNumbers().then(function(response){
              var habitNumbers = response.data.number;
              for(var j=0; j<habitNumbers.length; j++){
                for(var i=0; i<habits.length; i++){
                  if(habits[i].id === habitNumbers[j].id){
                    habitApp.habits.push(Habit.build(habits[i], habitNumbers[j].days));  
                  }
                }    
              }
            });

          }
        });  
      }
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

    function toolTipTodayText(habit) {
      var toolTipString = '';
      if(habit.current > 0){
        toolTipString = 'great job! you have completed your habit today :)';
      } else {
        toolTipString = 'oops.. you have not started your habit today';
      }
      return toolTipString;
    }

    function toolTipStreakText(habit) {
      var toolTipString = '';
      if(habit.streak > 1){
        toolTipString = 'congrats on your ' + habit.streak + ' days streak!';
      }
      else if(habit.streak === 1){
        toolTipString = 'good start for your habit streak';
      }
      else {
        toolTipString = 'oh.. you have not started with \"' + habit.name + '\" habit';
      }
      return toolTipString;
    }

    function toolTipLastWeekText(streak, lastWeekStreakLength, index) {
      var toolTipString = '';
      if(streak > 0){
        if(lastWeekStreakLength -1 === index){
          toolTipString = 'awesome! you have finished habit today';
        } else{
          toolTipString = 'awesome! you had finished habit';
        }
      } else if(lastWeekStreakLength -1 === index){
        toolTipString = 'you have a chance to do your habit';
      } else {
        toolTipString = 'oops.. you had missed habit';
      }
      return toolTipString;
    }

    function openAddHabitModal(){
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'addHabitForm.html',
        controller: 'HabitModalInstanceCtrl',
        resolve: {
          currentHabits: function () {
            return habitApp.habits;
          }
        }
      });
      modalInstance.result.then(function (habitName) {
        habitApp.addHabit(habitName);
      });
    }

    initializeHabitsToday();
  });
