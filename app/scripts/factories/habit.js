'use strict';

angular.module('codeApp')
	.factory('Habit', function(){

		function Habit(){
			this.id = 0;
			this.name = '';
      this.streak = 0;
      this.created = new Date();
      this.status = [{}];
      this.state = [0];
      this.current = [0];
      this.uri = '';
		}

		Habit.prototype.requestBody = function(){
			var request = {
				name : this.name,
	      streak : this.streak,
	      created : moment(this.created).unix(),
	      status : statusToUnix(this.status),
	      state : this.state,
	      current : this.current
			};

			return request;
		};

		Habit.build = function(habitData){
			var habit = new Habit();

			habit.id = habitData.id;
			habit.name = habitData.name;
      habit.streak = habitData.streak;
      habit.created = habitData.created;
      habit.status = habitData.status;
      habit.state = habitData.state;
      habit.current = habitData.current;
      habit.uri = habitData.uri;

			return habit;
		};

		function statusToUnix(statusData){
			var allStatus = [];
			for(var i=0; i<statusData.length; i++){
				var status = {};
				if(typeof statusData.started !== 'undefined'){
					status.started = moment(statusData.started).unix();
				}
				if(typeof statusData.finished !== 'undefined'){
					status.finished = moment(statusData.finished).unix();
				}
				allStatus.push(status);
			}
			return allStatus;
		}
		return Habit;
	});