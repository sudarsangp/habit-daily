'use strict';

angular.module('codeApp')
	.factory('Habit', function (TimeService, DbHabitService){

		function Habit(){
			this.id = 0;
			this.name = '';
      this.streak = 0;
      this.created = new Date();
      this.status = {};
      this.state = 0;
      this.current = 0;
      this.uri = '';
		}

		Habit.prototype.requestBody = function(){
			var request = {
				name : this.name,
	      streak : this.streak,
	      created : moment(this.created).unix(),
	      status : [statusToUnix(this.status)],
	      state : [this.state],
	      current : [this.current]
			};

			return request;
		};

		Habit.build = function(habitData, numbers){
			var today = new Date();
			var habit = new Habit();

			habit.id = habitData.id;
			habit.uri = habitData.uri;
			habit.name = habitData.name;
      habit.streak = habitData.streak;
      habit.created = moment(habitData.created * 1000).toDate();

      if(moment(habit.created).date() !== moment(today).date()){
        if(numbers <= (moment(moment(today) - moment(habit.created)).date())) {
        	DbHabitService.runOnceHabit(habit.id);
          habit.status = {};
          habit.current = 0;
          habit.state = 0;
        }
        else {
        	habit.status = statusToTime(habitData.status[habitData.status.length - 1]);
		      habit.status.timeDifference = TimeService.formatTime(TimeService.calculateTimeDifference(
	        	habit.status.started * 1000,
	        	habit.status.finished * 1000));
		      habit.state = habitData.state[habitData.state.length - 1];
		      habit.current = habitData.current[habitData.current.length - 1];
        }
      } else {
	      habit.status = statusToTime(habitData.status[habitData.status.length - 1]);
	      habit.status.timeDifference = TimeService.formatTime(TimeService.calculateTimeDifference(
        	habit.status.started,
        	habit.status.finished));
	      habit.state = habitData.state[habitData.state.length - 1];
	      habit.current = habitData.current[habitData.current.length - 1];
      }

			return habit;
		};

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

		function statusToTime(statusData){
			var status = {};
			if(typeof statusData.started !== 'undefined'){
				status.started = moment(statusData.started * 1000).toDate();
			}
			if(typeof statusData.finished !== 'undefined'){
				status.finished = moment(statusData.finished * 1000).toDate();
				status.timeDifference = TimeService.formatTime(TimeService.calculateTimeDifference(status.started, status.finished));
			}
			return status;
		}

		return Habit;
	});