'use strict';

angular.module('codeApp')
	.factory('Token', function (){
		var currentRefreshToken;

		return {
	    setRefreshToken: function(token){
	      currentRefreshToken = token;
	    },
	    getRefreshToken: function(){
	      return currentRefreshToken;
	    }
	  };
	});
