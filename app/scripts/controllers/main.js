'use strict';

/**
 * @ngdoc controller
 * @name codeApp.controller:MainCtrl
 * @description
 * to handle basic functionalities
 */
angular.module('codeApp')
  .controller('MainCtrl', function ($scope, $window, TimeService, LocalStorageService, $mdToast, $uibModal, DbHabitService, Habit, $timeout, Token) {
    var habitApp = this;

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

    $scope.isEndpointAlive = false;

    $scope.$watch('online', function (newValue, oldValue){
      if(newValue !== oldValue){
        var habits;
        var habitNumbers;
        var today = moment().local();
        var todayHabits;
        if(newValue){
          DbHabitService.getAllHabitsData().then(function (response){
            habits = response.data.habits || [];
            LocalStorageService.setAllHabitsData(habits);
            DbHabitService.habitNumbers().then(function(response){
              var habitNumbers = response.data.number;
              LocalStorageService.setHabitNumbers(habitNumbers);
              for(var j=0; j<habitNumbers.length; j++){
                for(var i=0; i<habits.length; i++){
                  if(habits[i].id === habitNumbers[j].id && habitApp.habits[i].id !== habits[i].id){
                    habitApp.habits.push(Habit.build(habits[i], habitNumbers[j].days));  
                  }
                }    
              }
            });
          });
        }
        else {
          habits = LocalStorageService.getAllHabitsData() || [];  
          habitNumbers = LocalStorageService.getHabitNumbers();
          for(var j=0; j<habitNumbers.length; j++){
            for(var i=0; i<habits.length; i++){
              if(habits[i].id === habitNumbers[j].id && habitApp.habits[i].id !== habits[i].id){
                habitApp.habits.push(Habit.build(habits[i], habitNumbers[j].days));  
              }
            }    
          }
        }
      }
    });
    
    $scope.$watch('token', function (newValue, oldValue){
      if(newValue !== oldValue){
        var habits;
        var habitNumbers;
        var today = moment().local();
        var todayHabits;
        DbHabitService.getAllHabitsData().then(function (response){
          habits = response.data.habits || [];
          console.log(habits);
          LocalStorageService.setAllHabitsData(habits);
          DbHabitService.habitNumbers().then(function(response){
            var habitNumbers = response.data.number;
            LocalStorageService.setHabitNumbers(habitNumbers);
            for(var j=0; j<habitNumbers.length; j++){
              for(var i=0; i<habits.length; i++){
                if(habits[i].id === habitNumbers[j].id && habitApp.habits[i].id !== habits[i].id){
                  habitApp.habits.push(Habit.build(habits[i], habitNumbers[j].days));  
                }
              }
            }
          });
        });
      }
    });
    // $scope.$watch('isEndpointAlive', function (newValue, oldValue){
      
    //   if(newValue !== oldValue) {
    //     if(newValue) {
    //       DbHabitService.getAllHabitsData().then(function (response){
    //         var endpointHabits = response.data.habits;
    //         for(var i=0; i<habitApp.habits.length; i++){
    //           if(typeof habitApp.habits[i].id === 'undefined'){
    //             var newHabit = Habit.build(habitApp.habits[i]);
    //             // not sure how to prevent the race condition while habits get created when server goes down and then up
    //             DbHabitService.createHabit(newHabit.requestBody()).then(function (response){
    //               for(var j=0; j<habitApp.habits.length; j++){
    //                 if(habitApp.habits[j].name === response.data.habit.name){
    //                   habitApp.habits[j].id = response.data.habit.id;
    //                   habitApp.habits[j].uri = response.data.habit.uri;
    //                 }
    //               }
    //               LocalStorageService.updateHabitWithServerData(response.data.habit);
    //             });
    //           }
    //         }
    //       });
    //     }
    //   }
    
    // });

    function addHabit(habitName) {
      if(habitName){
        var habit = new Habit();
        habit.name = habitName;
        habitApp.habitName = '';
        DbHabitService.createHabit(habit.requestBody()).then(function (response){
          if(!response){
            habitApp.habits.push(habit);
            LocalStorageService.addHabit(habit);
            $scope.isEndpointAlive = false;
          } else {
            habit = Habit.build(response.data.habit);
            habitApp.habits.push(habit);
            console.log(habit);
            LocalStorageService.addHabit(habit);
            $scope.isEndpointAlive = true;
          }
          
          $mdToast.show(
            $mdToast.simple()
              .textContent('created \"' + habit.name + '\" habit')
              .position(habitApp.defaultToastPosition)
              .hideDelay(habitApp.defaultToastDisplayTime)
          );
          // habit.lastWeekStreak = lastWeekHabitStreak(habit);
          
        });
      }
    }

    function removeHabit(position) {
      if($window.confirm('habitApp action will delete habitApp habit')){

        DbHabitService.deleteHabit(habitApp.habits[position].id).then(function(response){
          if(!response){
            $scope.isEndpointAlive = false;
          } else {
            $scope.isEndpointAlive = true;
          }
          LocalStorageService.removeHabit(position);
          LocalStorageService.removeHabitNumbers(position);
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
          $scope.isEndpointAlive = false;
        } else {
          $scope.isEndpointAlive = true;
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
      var streakLength = habitApp.habits[position].lastWeekStreak.length; 
      habitApp.habits[position].lastWeekStreak[streakLength - 1] = 1;
      
      DbHabitService.updateHabit(habitApp.habits[position].requestBody(), habitApp.habits[position].id).then(function (response){
        if(!response){
          LocalStorageService.modifyHabit(position, habitApp.habits[position]);
          $scope.isEndpointAlive = false;
        } else {
          $scope.isEndpointAlive = true;
        }
        $mdToast.show(
          $mdToast.simple()
            .textContent('congrats on finishing \"' + habitApp.habits[position].name + '\" habit')
            .position(habitApp.defaultToastPosition)
            .hideDelay(habitApp.defaultToastDisplayTime)
        );
      });

      // habitApp.habits[position].lastWeekStreak = lastWeekHabitStreak(habitApp.habits[position]);
    }

    function initializeHabitsToday() {
      var habits;
      var today = moment().local();
      var todayHabits;
      var habitNumbers = [];
      var isEmptyInitial = true;
      habitApp.habits = [];
      
      if(!$window.navigator.onLine || typeof Token.getRefreshToken() === 'undefined') {
        habits = LocalStorageService.getAllHabitsData() || [];  
        habitNumbers = LocalStorageService.getHabitNumbers();
        for(var j=0; j<habitNumbers.length; j++){
          for(var i=0; i<habits.length; i++){
            if(isEmptyInitial){
              if(habits[i].id === habitNumbers[j].id){
                habitApp.habits.push(Habit.build(habits[i], habitNumbers[j].days));  
              }
            }
            else {
              if(habits[i].id === habitNumbers[j].id && habitApp.habits[i].id !== habits[i].id){
                habitApp.habits.push(Habit.build(habits[i], habitNumbers[j].days));  
              }
            }
          }    
        }
      } 
      else {
        DbHabitService.getAllHabitsData().then(function (response){
          if(!response){
            habits = LocalStorageService.getAllHabitsData() || [];  
            habitNumbers = LocalStorageService.getHabitNumbers();
            for(var j=0; j<habitNumbers.length; j++){
              for(var i=0; i<habits.length; i++){
                if(isEmptyInitial){
                  if(habits[i].id === habitNumbers[j].id){
                    habitApp.habits.push(Habit.build(habits[i], habitNumbers[j].days));  
                  }
                }
                else {
                  if(habits[i].id === habitNumbers[j].id && habitApp.habits[i].id !== habits[i].id){
                    habitApp.habits.push(Habit.build(habits[i], habitNumbers[j].days));  
                  }
                }
              }    
            }
            $scope.isEndpointAlive = false;
          }
          else {
            habits = response.data.habits || [];
            LocalStorageService.setAllHabitsData(habits);
            DbHabitService.habitNumbers().then(function(response){
              habitNumbers = response.data.number;
              LocalStorageService.setHabitNumbers(habitNumbers);
              for(var j=0; j<habitNumbers.length; j++){
                for(var i=0; i<habits.length; i++){
                  if(habits[i].id === habitNumbers[j].id){
                    habitApp.habits.push(Habit.build(habits[i], habitNumbers[j].days));  
                  }
                }    
              }
              DbHabitService.lastWeekStreak().then(function (response){
                var streakData = response.data.lastweek
                for(var i=0; i<streakData.length; i++){
                  for(var j=0; j<habitApp.habits.length; j++){
                    if(streakData[i].id === habitApp.habits[j].id){
                      habitApp.habits[j].lastWeekStreak = streakData[i].streak;
                    }
                  }
                }
              });
            });
            $scope.isEndpointAlive = true;
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
