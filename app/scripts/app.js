'use strict';

/**
 * @ngdoc overview
 * @name codeApp
 * @description
 * # codeApp
 *
 * Main module of the application.
 */
angular
  .module('codeApp', [
  	'angularMoment',
  	'ui.bootstrap',
  	'LocalStorageModule',
  	'ngMaterial',
  	'luegg.directives',
  	'ui.validate'
  ])
  .config(function(localStorageServiceProvider){
  	localStorageServiceProvider.setPrefix('habit');
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q) {
      return {
        responseError: function(rejection) {
          if(rejection.status <= 0) {
              console.log('api is offline');
              return;
          }
          return $q.reject(rejection);
        }
      };
    });
  });
