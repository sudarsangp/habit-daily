'use strict';

angular.module('codeApp')
	.controller('HabitModalInstanceCtrl', function($scope, $uibModalInstance, currentHabits){
		$scope.addHabit = addHabit;
		$scope.currentHabits = currentHabits;
		$scope.notDuplicateHabit = notDuplicateHabit;

		function addHabit(habitName){
			$uibModalInstance.close(habitName);
		}

		function notDuplicateHabit(habitName){
			for(var i=0; i<$scope.currentHabits.length; i++){
				if($scope.currentHabits[i].name === habitName){
					return false;
				}
			}
			return true;
		}
	});