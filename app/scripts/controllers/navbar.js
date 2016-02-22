'use strict';

angular.module('codeApp')
	.controller('NavbarCtrl', function ($uibModal, DbHabitService, $rootScope){
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
        console.log(data);
        DbHabitService.signInUser(data).then(function (response){
          $rootScope.token = response.data.token;
        }, function(){
          console.log('error');
        });
      });
    }
	});