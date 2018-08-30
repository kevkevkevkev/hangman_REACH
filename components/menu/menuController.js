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
}]);

