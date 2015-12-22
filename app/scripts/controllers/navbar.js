'use strict';

angular.module('codeApp')
	.controller('NavbarCtrl', function(){
		var navbar = this;
		
		navbar.today = moment().local().format('dddd[,] Do MMMM YYYY');
	});