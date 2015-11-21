describe('basic habit workflows', function() {

  describe('adding habits: ', function(){
    beforeEach(function() {
      browser.get('index.html');
    });

    it('should add single habit', function() {
      var habitList = element.all(by.repeater('habit in main.habits'));
      expect(habitList.count()).toBe(0);

      var query = element(by.model('main.habitName'));
      query.sendKeys('hello world');
      expect(query.getAttribute('value')).toBe('hello world');

      element(by.buttonText('Add')).click();
      expect(habitList.count()).toBe(1);
    });

    it('should add multiple habits', function() {
      var habitList = element.all(by.repeater('habit in main.habits'));
      expect(habitList.count()).toBe(0);

      var query = element(by.model('main.habitName'));

      query.sendKeys('first habit');
      element(by.buttonText('Add')).click();

      query.sendKeys('second habit');
      element(by.buttonText('Add')).click();

      query.sendKeys('third habit');
      element(by.buttonText('Add')).click();

      expect(habitList.count()).toBe(3);
    });
  });
 
  // css class fa fa-times does not get added
  // describe('adding and removing habits: ', function(){
  //   beforeEach(function() {
  //     browser.get('index.html');
  //   });

  //   it('should be able to add a habit and remove a habit', function(){
  //     var query = element(by.model('main.habitName'));
  //     query.sendKeys('first habit');
  //     element(by.buttonText('Add')).click();
  //     var habitList = element.all(by.repeater('habit in main.habits'));
  //     var addedHabit = element.all(by.css('fa fa-times')).first();
  //     addedHabit.click();
  //     expect(habitList.count()).toBe(0);
  //   });
  });
});