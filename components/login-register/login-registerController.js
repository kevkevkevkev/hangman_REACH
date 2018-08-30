'use strict';

/*
 * Returns the user object of the user with id user_id
 */
hangmanApp.controller('LoginRegisterController', ['$scope', '$rootScope', '$routeParams', '$resource', '$location',
  function ($scope, $rootScope, $routeParams, $resource, $location) {

    // Initialize scope variables to keep track of username and password entry
    $scope.LoginRegisterController = {};
    $scope.LoginRegisterController.email_addressTextInput = "";
    $scope.LoginRegisterController.passwordTextInput = "";
    $scope.LoginRegisterController.confirmPasswordTextInput = "";
    $scope.LoginRegisterController.firstNameInput = "";
    $scope.LoginRegisterController.newRegisteredUser = [];

    $scope.LoginRegisterController.login = function() {
      console.log("Submitting login() request");
      var login_resource = $resource('/admin/login');
      var login_data = {
        email_address: $scope.LoginRegisterController.email_addressTextInput.toLowerCase(), 
        password: $scope.LoginRegisterController.passwordTextInput
      };
      
      $scope.main.active_user = login_resource.save(login_data, function () {
        console.log("changing location path to /menu");
        // Broadcast that the user is logged in
        $rootScope.$broadcast("Logged In");
      }, function errorHandling(err) {
          console.log(err);
      });
    };

    $scope.LoginRegisterController.register = function() {

      $scope.main.active_user_name = "Create new profile";

      var register_resource = $resource('/admin/register');
      var register_data = {
        email_address: $scope.LoginRegisterController.email_addressTextInput.toLowerCase(), 
        password: $scope.LoginRegisterController.confirmPasswordTextInput, 
        first_name: $scope.LoginRegisterController.firstNameInput, 
      };

      $scope.main.active_user = register_resource.save(register_data, function () {
        console.log("changing location path to /menu");
        $scope.LoginRegisterController.login();
      }, function errorHandling(err) {
          console.log(err);
      });
      console.log("Submitting register() request");
    };

    $scope.LoginRegisterController.switchToRegisterView = function() {
      $scope.main.registerView = true;
    };

    $scope.LoginRegisterController.switchToLoginView = function() {
      $scope.main.registerView = false;
    };    
  }]);
