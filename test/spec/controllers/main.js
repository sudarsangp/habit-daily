'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(function(){
    module('LocalStorageModule');
    module('codeApp');

    module(function($provide){
      $provide.service('localStorageService', function(){
        var habitsKey = 'dailyhabits';
        var storage = [];
        var get = jasmine.createSpy('get').and.callFake(function(key){
          // console.log(storage[key]);
          return storage[key];
        });
        var set = jasmine.createSpy('set').and.callFake(function(key, habitList){
          storage[key] = habitList;
        });
        return {
          get: get,
          set: set
        };
      });
    });
  });

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MainCtrl.awesomeThings.length).toBe(3);
  });

  /* User Story
  ** As a user i should be able to add a habit
  */
  describe('add habit', function(){
    // critical
    describe('ensure invalid habit details are caught', function() {

      it('empty undefined habit should not be created', function(){
        expect(MainCtrl.habits.length).toBe(0);
        MainCtrl.addHabit();
        expect(MainCtrl.habits.length).toBe(0);
      });
      
      it('empty string habit should not be created', function(){
        expect(MainCtrl.habits.length).toBe(0);
        MainCtrl.addHabit("");
        expect(MainCtrl.habits.length).toBe(0);
      });
    });

    it('ensure valid habit details pass validation', function() {
      var testHabitName = 'learn language';
      var testHabit = {
        'name': testHabitName, 
        'streak': 0, 
        'status': {'created': new Date()}, 
        'state': MainCtrl.habitState.CREATED,
        'lastweek': [0, 0, 0, 0, 0, 0, 0]
      };
      expect(MainCtrl.habits.length).toBe(0);
      MainCtrl.addHabit(testHabitName);
      expect(MainCtrl.habits.length).toBe(1);
      // expect(MainCtrl.habits[0]).toEqual(testHabit);
      expect(MainCtrl.habitName).toEqual('');
    });

    // good-to-have
    // it('input field should be cleared after adding habits', function() {});
    // it('able to add habits with pressing enter', function() {});
  });

  /* User Story
  ** As a user, i should be able to remove a habit
  */
  describe('remove habit', function(){
    it('ensure habit at a particular index can be removed', function(){
      spyOn(window, 'confirm').and.callFake(function () {
        return true;
      });
      MainCtrl.addHabit('ok');
      expect(MainCtrl.habits.length).toBe(1);
      MainCtrl.removeHabit(0);
      expect(MainCtrl.habits.length).toBe(0);
    });

    it('ensure habit is not removed when cancel option is selected', function(){
      spyOn(window, 'confirm').and.callFake(function () {
        return false;
      });
      MainCtrl.addHabit('ok');
      expect(MainCtrl.habits.length).toBe(1);
      MainCtrl.removeHabit(0);
      expect(MainCtrl.habits.length).toBe(1);
    });
  });

  /* User Story
  ** As a user, i should be able to start a habit
  */
  /* User Story
  ** As a user, when i start a habit it should show the date
  */
  describe('start habit', function(){
    it('ensure single habit can be started', function(){
      MainCtrl.addHabit('first habit');
      expect(MainCtrl.habits.length).toBe(1);
      MainCtrl.beginHabit(0);
      expect(MainCtrl.habits[0].streak).toBe(0);
      // expect(MainCtrl.habits[0].status.started).toEqual(new Date());
    });
  });

   /* User Story
  ** As a user, i should be able to finish a habit
  */
  describe('finish habit', function(){
    var timerCallback;
    beforeEach(function() {
      timerCallback = jasmine.createSpy("timerCallback");
      jasmine.clock().install();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it("causes a timeout to be called synchronously", function() {
    setTimeout(function() {
      timerCallback();
    }, 100);

    expect(timerCallback).not.toHaveBeenCalled();

    jasmine.clock().tick(101);

    expect(timerCallback).toHaveBeenCalled();
  });

    it('ensure single habit can be finished', function(){
      MainCtrl.addHabit('first habit');
      expect(MainCtrl.habits.length).toBe(1);
      MainCtrl.finishHabit(0);
      expect(MainCtrl.habits[0].streak).toBe(1);
      // expect(MainCtrl.habits[0].lastweek[6]).toBe(1);
      // expect(MainCtrl.habits[0].status.finished).toEqual(new Date());
    });
  });
  /* User Story
  ** As a user, i should be able to edit an existing habit
  */
  // not able to add unit test for contenteditable item -
  // cannot be done as contenteditable is added in html and check coverage docs for validation


});
