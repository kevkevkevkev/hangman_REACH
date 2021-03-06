'use strict';

/*
 * Manages the main menu, which displays the leaderboard and
 * includes the option to start a new game.
 */
hangmanApp.controller('MenuController', ['$scope', '$rootScope', '$routeParams', '$resource', '$location',
  function ($scope, $rootScope, $routeParams, $resource, $location) {

  $scope.MenuController = {};

  /*******************
   * Start New Game *
   *******************/

  $scope.MenuController.startGame = function() {
    $location.path("/game");
  };

  /************************
   * Populate Leaderboard *
   ************************/

  $scope.MenuController.users = [];

  /**
   * Loads all users who have played at least one game from
   * the db via the server.
   */
  $scope.MenuController.loadUsers = function() {
    var users_resource = $resource('/leaderboard/get_users');
    $scope.MenuController.users = users_resource.query({}, function() {
		// Sort users by wins
		$scope.MenuController.users.sort(function(a, b) { 
			if (a !== b) {
			  return (b.wins-a.wins);
			} else {
        // If users have the same wins, sort by when the account was created
			  return a.date_time-b.date_time;
			}
		});
    }, function errorHandling(err) {
        console.log(err);
    });
  };
  $scope.MenuController.loadUsers();  
}]);

