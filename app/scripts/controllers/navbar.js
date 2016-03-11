'use strict';

angular.module('codeApp')
	.controller('NavbarCtrl', function ($uibModal, DbHabitService, $rootScope, Token, $mdToast){
		var navbar = this;
		var signInToast;
    var defaultToastPosition = 'bottom left';
    var defaultToastDisplayTime = 3000;

		navbar.userLoggedIn = false;
		navbar.today = moment().local().format('dddd[,] Do MMMM YYYY');
		navbar.openSignInModal = openSignInModal;
    navbar.userLogOut = userLogOut;
    navbar.openSignUpModal = openSignUpModal;

		function openSignInModal(){
      var modalInstance = $uibModal.open({
        templateUrl: 'userSignIn.html',
        controller: 'SignInModalCtrl'
      });
      modalInstance.result.then(function (data){
        DbHabitService.signInUser(data).then(function (response){
          navbar.userLoggedIn = true;
          $rootScope.token = response.data.token;
          Token.setRefreshToken(response.data.token);
          $mdToast.hide();
        }, function(){
          console.log('error');
        });
      });
    }

    function showNotLoggedInToast() {
      signInToast = $mdToast.show(
        $mdToast.simple()
          .textContent('Sign In for more features')
          .action('Sign In')
          .highlightAction(true)
          .hideDelay(0)
      );
      signInToast.then(function (response){
        if(response == 'ok'){
          openSignInModal();
        }
      })
    }

    function userLogOut(){
      navbar.userLoggedIn = false;
      $rootScope.token = null;
    }
    showNotLoggedInToast();

    function openSignUpModal(){
       var modalInstance = $uibModal.open({
        templateUrl: 'userSignUp.html',
        controller: 'SignUpModalCtrl'
      });
       modalInstance.result.then(function (data){
        DbHabitService.signUpUser(data).then(function (response){
          $mdToast.show(
            $mdToast.simple()
              .textContent('created \"' + response.data.username + '\" user')
              .position(defaultToastPosition)
              .hideDelay(defaultToastDisplayTime)
          );
        }, function(){
          console.log('error');
        });
      });
    }
	});