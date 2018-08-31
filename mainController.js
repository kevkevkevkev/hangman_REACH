'use strict';

var hangmanApp = angular.module('hangmanApp', ['ngRoute', 'ngMaterial', 'ngResource', 
    'ngMessages', 'LocalStorageModule', 'angularMoment']);

hangmanApp.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

hangmanApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.                      
            when('/menu', {
                templateUrl: 'components/menu/menuTemplate.html',
                controller: 'MenuController'
            }).
            when('/login-register', {
                templateUrl: 'components/login-register/login-registerTemplate.html',
                controller: 'LoginRegisterController'
            }).
            when('/game', {
                templateUrl: 'components/game/gameTemplate.html',
                controller: 'GameController'
            }).
            when('/user-profile', {
                templateUrl: 'components/profile/profileTemplate.html'
            }).
            otherwise({
                redirectTo: '#'
            });
    }]);

hangmanApp.config(function($mdThemingProvider) {

  $mdThemingProvider.theme('modal')
    .primaryPalette('grey')
    .accentPalette('orange');
});

hangmanApp.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('hangman');
}]);


hangmanApp.controller('MainController', ['$scope', '$rootScope', '$location', 
    '$http', '$resource', '$mdDialog', 'localStorageService', '$mdPanel', 'moment',
      function ($scope, $rootScope, $location, $http, $resource, $mdDialog, localStorageService, $mdPanel) {
        $scope.main = {};
        $scope.main.noOneIsLoggedIn = true;
        $scope.main.registerView = false;
        $scope.main.session = {};
        $scope.main.active_user = [];

        $scope.main.saveSession = function() {

            // Save the current session in local storage
            var session_resource = $resource('/get-current-session');
            var current_session = session_resource.get({}, function () {
                localStorageService.set('session', current_session);
            }, function errorHandling(err) {
                console.log(err);
            });            
        }

        // Bring the user to the main menu/leaderboard
        $scope.main.toMenu = function() {
            $location.path("/menu");
        }

        /* This listener will execute the associated function when the user has 
         * successfully logged on––it will update the display values. */
        $scope.$on("Logged In", function () {        
            $scope.main.noOneIsLoggedIn = false;
            // Save the current session in local storage
            $scope.main.saveSession();
            $location.path("/menu");
        });

        /* When the user clicks logout, call the logout function */ 
        $scope.$on("Logout", function () {
            $location.path("/login-register");              
            $scope.main.logout();
        });        

        /* When the user clicks "logout" on the toolbar, execute a post request
         * to logout */
        $scope.main.logout = function() {
            console.log("Submitting logout() request");
            var logout_resource = $resource('/admin/logout');
            logout_resource.save(function () {
                // Broadcast that the user is logged in
                $rootScope.$broadcast("Logged Out");
            }, function errorHandling(err) {
                console.log(err);
            });
        };  

        /* When the user has logged out, this listener will return the user to
         * the login page. */ 
        $scope.$on("Logged Out", function () {
            console.log("Logout successful");
            $scope.main.noOneIsLoggedIn = true;
            $scope.main.active_user = [];
            localStorageService.clearAll();
            $scope.main.session = {};
        });

        /* When the user first loads the webpage, if there is no session saved,
         * this listener will direct the user to the login page */
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            //localStorageService.clearAll();
          if ($scope.main.noOneIsLoggedIn) {
            // If session saved in local storage, restore session and direct to /menu
            if (localStorageService.get('session')) {
                var session_resource = $resource('/restore-session');
                var saved_session = localStorageService.get('session');
                var restore_session_data = {email_address: saved_session.email_address};
                $scope.main.active_user = session_resource.save(restore_session_data, function () {
                    // Broadcast that the user is logged in
                    $rootScope.$broadcast("Logged In");
                    }, function errorHandling(err) {
                     console.log(err);
                });                
            }
            // If no logged-in user or saved session, redirect to /login-register unless already there
            else if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
                $location.path("/login-register");
            }
          }
        });      
    }]);
