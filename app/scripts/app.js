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
        request: function(config) {
          config.headers['Authorization'] = '';
          return config;
        },
        responseError: function(rejection) {
          if(rejection.status <= 0) {
              return false;
          }
          return $q.reject(rejection);
        }
      };
    });
  })
  .run(function($window, $rootScope) {
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
      $rootScope.$apply(function() {
        $rootScope.online = false;
      });
    }, false);
    $window.addEventListener("online", function () {
      $rootScope.$apply(function() {
        $rootScope.online = true;
      });
    }, false);
  });

