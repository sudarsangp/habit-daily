'use strict';

angular.module('codeApp')
	.controller('SignInModalCtrl', function ($scope, $uibModalInstance){
		$scope.signInUser = signInUser;

		function signInUser(username, password){
			var result = {
				'username': username,
				'password': password
			};
			$uibModalInstance.close(result);
		}
	});
