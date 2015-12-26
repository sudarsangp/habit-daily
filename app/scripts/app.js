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
  	'luegg.directives'
  ])
  .config(function(localStorageServiceProvider){
  	localStorageServiceProvider.setPrefix('habit');
  });
