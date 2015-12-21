'use strict';

angular.module('codeApp')
	.service('TimeService', function(){
		this.calculateTimeDifference = calculateTimeDifference;
		this.formatTime = formatTime;
    this.updateHabitDaily = updateHabitDaily;

		var timeFormatStrings = Object.freeze({
      HOUR: 'hour',
      HOURS: 'hours',
      MINUTE: 'minute',
      MINUTES: 'minutes',
      SECOND: 'second',
      SECONDS: 'seconds',
      MILLISECONDS: 'milliseconds',
      MILLISECOND: 'millisecond'
    });

		function calculateTimeDifference(startTime, endTime){
      var start = moment(startTime);
      var end = moment(endTime);
      var timeDifference = moment.utc(end.diff(start));
      return timeDifference;
    }

    function formatTime(time){
      var result = time;
      var hoursFormat = timeFormatStrings.HOURS;
      var minutesFormat = timeFormatStrings.MINUTES;
      var secondsFormat = timeFormatStrings.SECONDS;
      var millisecondsFormat = timeFormatStrings.MILLISECONDS;

      if(time.seconds() > 0 && time.minutes() > 0 && time.hours() > 0){
        if(time.seconds() === 1){
          secondsFormat = timeFormatStrings.SECOND;
        }
        if(time.minutes() === 1){
          minutesFormat = timeFormatStrings.MINUTE;
        }
        if(time.hours() === 1){
          hoursFormat = timeFormatStrings.HOUR;
        }
        result = time.format('H ['+ hoursFormat +'] m [' + minutesFormat + '] s [' + secondsFormat + ']');
      }
      else if(time.seconds() > 0 && time.minutes() > 0){
        if(time.seconds() === 1){
          secondsFormat = timeFormatStrings.SECOND;
        }
        if(time.minutes() === 1){
          minutesFormat = timeFormatStrings.MINUTE;
        }
        result = time.format('m [' + minutesFormat + '] s [' + secondsFormat + ']');
      }
      else if(time.seconds() > 0){
        if(time.seconds() === 1){
          secondsFormat = timeFormatStrings.SECOND;
        }
        result = time.format('s [' + secondsFormat + ']');
      }
      else{
        if(time.milliseconds() === 1){
          millisecondsFormat = timeFormatStrings.MILLISECOND;
        }
        result = time.format('SSS [' + millisecondsFormat + ']');
      }
      return result;
    }

    function updateHabitDaily(habits, today) {
      for(var i=0; i<habits.length; i++){
        // var index = habits[i].status.length - 1;
        if(moment(habits[i].created).date() !== moment(today).date()){
          if(habits[i].status.length <= (moment(today).date() - moment(habits[i].created).date())) {
            habits[i].current.push(0);
            habits[i].state.push(0);
            habits[i].status.push({});
          }
        }
      }
      return habits;
    }
	});