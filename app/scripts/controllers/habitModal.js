'use strict';

angular.module('codeApp')
	.controller('HabitModalInstanceCtrl', function($scope, $uibModalInstance){
		$scope.addHabit = addHabit;

		function addHabit(habitName){
			$uibModalInstance.close(habitName);
		}
	});