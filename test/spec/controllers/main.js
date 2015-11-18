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
    it('ensure invalid habit details are caught', function() {});

    it('ensure valid habit details pass validation', function() {
      expect(MainCtrl.habits.length).toBe(0);
      MainCtrl.addHabit('language');
      expect(MainCtrl.habits.length).toBe(1);
      expect(MainCtrl.habits[0]).toEqual('language');
    });

    it('ensure adding habit shows added habit', function() {});
  });
});
