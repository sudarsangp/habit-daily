'use strict';

angular.module('codeApp')
	.controller('NavbarCtrl', function ($uibModal, DbHabitService, $rootScope, Token){
		var navbar = this;
		
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
          console.log(data);
          $rootScope.token = response.data.token;
          Token.setRefreshToken(response.data.token);
        }, function(){
          console.log('error');
        });
      });
    }
	});