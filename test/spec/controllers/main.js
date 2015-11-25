'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('codeApp'));

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
      var testHabit = 'learn language';
      expect(MainCtrl.habits.length).toBe(0);
      MainCtrl.addHabit(testHabit);
      expect(MainCtrl.habits.length).toBe(1);
      expect(MainCtrl.habits[0]).toEqual(testHabit);
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
  ** As a user, i should be able to edit an existing habit
  */
  // not able to add unit test for contenteditable item -
  // cannot be done as contenteditable is added in html and check coverage docs for validation
});
