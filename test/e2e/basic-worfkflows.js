describe('basic habit workflows', function() {

  describe('adding habits: ', function(){
    beforeEach(function() {
      browser.get('index.html');
    });

    it('should add single habit', function() {
      var habitList = element.all(by.repeater('habit in main.habits'));
      element(by.buttonText('Add')).click();
      expect(habitList.count()).toBe(0);

      var query = element(by.model('main.habitName'));
      query.sendKeys('hello world');
      expect(query.getAttribute('value')).toBe('hello world');

      element(by.buttonText('Add')).click();
      expect(habitList.count()).toBe(1);
    });

    it('should add multiple habits', function() {
      var habitList = element.all(by.repeater('habit in main.habits'));
      element(by.buttonText('Add')).click();
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
  
  // describe('edit habits: ', function(){
  //   beforeEach(function() {
  //     browser.get('index.html');
  //   });

  //   it('should be able to edit habit', function() {
  //     var query = element(by.model('main.habitName'));
  //     query.sendKeys('first habit');
  //     element(by.buttonText('Add')).click();
  //     element.all(by.repeater('habit in main.habits')).then(function(habits){
  //       habits[0].element(by.className('habit-item')).click();
  //     });
  //   });
  // });

  describe('adding and removing habits: ', function(){
    beforeEach(function() {
      browser.get('index.html');
    });

    it('should be able to add a habit and remove a habit', function(){
      var query = element(by.model('main.habitName'));
      query.sendKeys('first habit');
      element(by.buttonText('Add')).click();

      var habitList = element.all(by.repeater('habit in main.habits'));
      element.all(by.repeater('habit in main.habits')).then(function(habits){
        habits[0].element(by.className('glyphicon-remove')).click();
        browser.switchTo().alert().accept();
        expect(habitList.count()).toBe(0);
      });
    });
  });

  // removing multiple habits
  // describe('adding and removing multiple habits: ', function(){
  //   beforeEach(function() {
  //     browser.get('index.html');
  //   });

  //   it('should be able to add a habit and remove a habit', function(){
  //     var query = element(by.model('main.habitName'));
  //     query.sendKeys('first habit');
  //     element(by.buttonText('Add')).click();
  //     query.sendKeys('second habit');
  //     element(by.buttonText('Add')).click();

  //     var habitList = element.all(by.repeater('habit in main.habits'));
  //     element.all(by.repeater('habit in main.habits')).then(function(habits){
  //       // for(var i=0; i<habits.length; i++){
  //         console.log(habits.length);
  //         habits[0].element(by.className('glyphicon-remove')).click();
  //         browser.switchTo().alert().accept();
  //         expect(habitList.count()).toBe(1);
  //       // }
  //         habits[0].element(by.className('glyphicon-remove')).click();
  //         browser.switchTo().alert().accept();
  //         expect(habitList.count()).toBe(0);
  //     });
  //   });
  // });
});