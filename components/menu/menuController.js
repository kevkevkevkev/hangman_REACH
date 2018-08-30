'use strict';

/*
 * Manages the main menu, which includes the options: 
 * 1) start a new game;
 * 2) view leaderboards;
 */
hangmanApp.controller('MenuController', ['$scope', '$rootScope', '$routeParams', '$resource', '$location', '$mdDialog',
  function ($scope, $rootScope, $routeParams, $resource, $location, $mdDialog) {

  $scope.MenuController = {};

  /*******************
   * Start New Game *
   *******************/

  $scope.MenuController.startGame = function() {
    console.log("startGame() called");
    $location.path("/game");
  };

  /************************
   * Populate Leaderboard *
   ************************/

   $scope.MenuController.users = [];

  $scope.MenuController.loadUsers = function() {
    var users_resource = $resource('/leaderboard/get_users');
    $scope.MenuController.users = users_resource.query({}, function() {
		// Sort users by wins
		$scope.MenuController.users.sort(function(a, b) { 
			if (a !== b) {
			  return (b.wins-a.wins);
			} else {
			  return a.date_time-b.date_time;
			}
		});
    }, function errorHandling(err) {
        console.log(err);
    });
  };

  $scope.MenuController.loadUsers();  

}]);

