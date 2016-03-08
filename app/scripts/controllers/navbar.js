'use strict';

angular.module('codeApp')
	.controller('NavbarCtrl', function ($uibModal, DbHabitService, $rootScope, Token, $mdToast){
		var navbar = this;
		var signInToast;

		navbar.userLoggedIn = false;
		navbar.today = moment().local().format('dddd[,] Do MMMM YYYY');
		navbar.openSignInModal = openSignInModal;

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

    showNotLoggedInToast();
	});