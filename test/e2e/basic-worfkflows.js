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
  });
 
});