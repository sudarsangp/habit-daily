describe('basic habit workflows', function() {
  beforeEach(function() {
      browser.get('index.html');
  });
  
  afterEach(function() {
    browser.executeScript('window.localStorage.clear();');
  });

  describe('adding habits: ', function(){
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

    it('should be able to add a habit and not allowing removing a habit', function(){
      var query = element(by.model('main.habitName'));
      query.sendKeys('first habit');
      element(by.buttonText('Add')).click();

      var habitList = element.all(by.repeater('habit in main.habits'));
      element.all(by.repeater('habit in main.habits')).then(function(habits){
        habits[0].element(by.className('glyphicon-remove')).click();
        browser.switchTo().alert().dismiss();
        expect(habitList.count()).toBe(1);
      });
    });
  });

  // removing multiple habits
  // describe('adding and removing multiple habits: ', function(){
  //   it('should be able to add a habit and remove a habit', function(){
  //     var query = element(by.model('main.habitName'));
  //     query.sendKeys('first habit');
  //     element(by.buttonText('Add')).click();
  //     query.sendKeys('second habit');
  //     element(by.buttonText('Add')).click();

  //     var habitList = element.all(by.repeater('habit in main.habits'));
  //     habitList.then(function(habits){
  //       // for(var i=0; i<habits.length; i++){
  //         // console.log(habits[0]);
  //         // console.log(habits[1]);
  //         habits[0].element(by.className('glyphicon-remove')).click();
  //         browser.switchTo().alert().accept();
  //         habits[1].element(by.className('glyphicon-remove')).click();
  //         browser.switchTo().alert().accept();
  //         expect(habitList.count()).toBe(0);

  //       // }
          
  //         // browser.switchTo().alert().accept();
  //         // expect(habitList.count()).toBe(0);
  //     });
  //   });
  // });

  describe('starting habits: ', function(){
    it('should be start a habit after adding ', function(){
      var query = element(by.model('main.habitName'));
      query.sendKeys('first habit');
      element(by.buttonText('Add')).click();

      var habitList = element.all(by.repeater('habit in main.habits'));
      habitList.then(function(habits){
        console.log()
        habits[0].element(by.id('streak')).getText().then(function(text){
          expect(text).toEqual('0');
        });
        habits[0].element(by.className('btn-success')).click();
        habits[0].element(by.id('streak')).getText().then(function(text){
          expect(text).toEqual('0');
        });
        // habits[0].element(by.className('streaking')).getText().then(function(text){
        //   expect(text).toEqual('1');
        // });
      });
    });
  });

  describe('finishing habits: ', function(){
    it('should be finish a habit after adding ', function(){
      var query = element(by.model('main.habitName'));
      query.sendKeys('first habit');
      element(by.buttonText('Add')).click();

      var habitList = element.all(by.repeater('habit in main.habits'));
      habitList.then(function(habits){
        habits[0].element(by.id('streak')).getText().then(function(text){
          expect(text).toEqual('0');
        });
        habits[0].element(by.className('btn-success')).click();
        habits[0].element(by.className('btn-primary')).click();
        habits[0].element(by.id('streak')).getText().then(function(text){
          expect(text).toEqual('1');
        });
      });
    });
  });
});