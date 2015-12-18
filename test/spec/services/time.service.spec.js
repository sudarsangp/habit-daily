'use strict';

describe('Service: TimeService', function(){
	beforeEach(module('codeApp'));
	
	var TimeService;

	beforeEach(function(){
		inject(function($injector){
			TimeService = $injector.get('TimeService');
		});
	});

	describe('calculate difference between 2 dates', function(){
		it('should return correct result for time parameter values', function(){
			var start = new Date(2015, 10, 27, 15, 30, 45);
			var end = new Date(2015, 10, 27, 16, 45, 50);
			var difference = TimeService.calculateTimeDifference(start, end);
			expect(difference.seconds()).toBe(5);
			expect(difference.minutes()).toBe(15);
			expect(difference.hours()).toBe(1);
		});
	});

	describe('fomat time for particular date', function(){

		describe('format for milliseconds', function(){
			it('should format time with milliseconds only', function(){
				var time = moment.utc(new Date(2015, 10, 27, 0, 0, 0, 500));
				var formatTime = TimeService.formatTime(time);
				expect(formatTime).toBe('500 milliseconds');
			});

			it('should format time with millisecond only', function(){
				var time = moment.utc(new Date(2015, 10, 27, 0, 0, 0, 1));
				var formatTime = TimeService.formatTime(time);
				expect(formatTime).toBe('001 millisecond');
			});
		});

		describe('format time for seconds ', function(){
			it('should format time with seconds only', function(){
				var time = moment.utc(new Date(2015, 10, 27, 0, 0, 23, 500));
				var formatTime = TimeService.formatTime(time);
				expect(formatTime).toBe('23 seconds');
			});

			it('should format time with second only', function(){
				var time = moment.utc(new Date(2015, 10, 27, 0, 0, 1, 1));
				var formatTime = TimeService.formatTime(time);
				expect(formatTime).toBe('1 second');
			});
		});

		describe('formt time for seconds and minutes', function(){
			it('should format time with minutes and seconds only', function(){
				var time = moment.utc(new Date(2015, 10, 27, 8, 10, 50, 500));
				var formatTime = TimeService.formatTime(time);
				expect(formatTime).toBe('10 minutes 50 seconds');
			});

			it('should format time with minute and second only', function(){
				var time = moment.utc(new Date(2015, 10, 27, 8, 1, 1, 1));
				var formatTime = TimeService.formatTime(time);
				expect(formatTime).toBe('1 minute 1 second');
			});
		});

		describe('formt time for seconds and minutes and hours', function(){
			it('should format time with hours and minutes and seconds only', function(){
				var time = moment.utc(new Date(2015, 10, 27, 15, 10, 50, 500));
				var formatTime = TimeService.formatTime(time);
				expect(formatTime).toBe('7 hours 10 minutes 50 seconds');
			});

			it('should format time with hour and minute and second only', function(){
				var time = moment.utc(new Date(2015, 10, 27, 9, 1, 1, 1));
				var formatTime = TimeService.formatTime(time);
				expect(formatTime).toBe('1 hour 1 minute 1 second');
			});
		});
	});

	describe('update habits daily', function(){
		it('should not be able to update habit on habit created date', function(){
			var testHabits = [{
        'name': 'habitName',
        'streak': 0,
        'status': [{'created': new Date()}],
        'state': [0],
        'current': [0]
      }];
      var today = new Date();
      var habitsResult = TimeService.updateHabitDaily(testHabits, today);
      expect(habitsResult[0].current.length).toBe(1);
		});

		it('should be able to update habit on consecutive date', function(){
			var testHabits = [{
        'name': 'habitName',
        'streak': 0,
        'status': [{'created': new Date(2015, 10, 27)}],
        'state': [0],
        'current': [0]
      }];
      var today = new Date(2015, 10, 28);
      var habitsResult = TimeService.updateHabitDaily(testHabits, today);
      expect(habitsResult[0].current.length).toBe(2);
		});

		it('should not be able to update habit on same day more than once', function(){
			var testHabits = [{
        'name': 'habitName',
        'streak': 0,
        'status': [{'created': new Date(2015, 10, 27)}],
        'state': [0],
        'current': [0]
      }];
      var today = new Date(2015, 10, 28);
      var habitsResult = TimeService.updateHabitDaily(testHabits, today);
      expect(habitsResult[0].current.length).toBe(2);
      habitsResult = TimeService.updateHabitDaily(testHabits, today);
      expect(habitsResult[0].current.length).toBe(2);
		});
	});
});