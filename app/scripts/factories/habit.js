'use strict';

angular.module('codeApp')
	.factory('Habit', function(){

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

		Habit.build = function(habitData){
			var habit = new Habit();

			habit.id = habitData.id;
			habit.name = habitData.name;
      habit.streak = habitData.streak;
      habit.created = moment(habitData.created).toDate();
      habit.status = habitData.status[habitData.status.length - 1];
      habit.state = habitData.state[habitData.state.length - 1];
      habit.current = habitData.current[habitData.current.length - 1];
      habit.uri = habitData.uri;

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

		return Habit;
	});