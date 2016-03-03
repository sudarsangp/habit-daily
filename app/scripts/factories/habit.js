'use strict';

angular.module('codeApp')
	.factory('Habit', function (TimeService, DbHabitService, Token, LocalStorageService){

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
      console.log(dateDiffInDays( new Date(habit.created), today));
      if(moment(habit.created).date() !== moment(today).date()){
        if(numbers <= (dateDiffInDays( new Date(habit.created), today))) {
        	if(typeof Token.getRefreshToken() === 'undefined'){
        		LocalStorageService.newDayModifyHabit(habit.id);
        	} else{
        		DbHabitService.runOnceHabit(habit.id);
        	}
          habit.status = {};
          habit.current = 0;
          habit.state = 0;
        }
        else {
        	habit.status = statusToTime(habitData.status[habitData.status.length - 1]);
		      habit.status.timeDifference = TimeService.formatTime(TimeService.calculateTimeDifference(
	        	habit.status.started,
	        	habit.status.finished));
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

		var _MS_PER_DAY = 1000 * 60 * 60 * 24;
		// a and b are javascript Date objects
		function dateDiffInDays(a, b) {
		  // Discard the time and time-zone information.
		  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

		  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
		}
		return Habit;
	});