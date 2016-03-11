'use strict';

angular.module('codeApp')
  .controller('SignUpModalCtrl', function ($scope, $uibModalInstance){
    $scope.signUpUser = signUpUser;

    function signUpUser(username, password){
      var result = {
        'username': username,
        'password': password
      };
      $uibModalInstance.close(result);
    }
  });
