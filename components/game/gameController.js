'use strict';

/*
 * Manages a game of hangman
 */
hangmanApp.controller('GameController', ['$scope', '$rootScope', '$routeParams', '$resource', '$location',
  function ($scope, $rootScope, $routeParams, $resource, $location) {

  $scope.GameController = {};
  $scope.GameController.gameIsOn = true;
  $scope.GameController.playerWon = true;

  // An object that will store the word for this game
  $scope.GameController.gameWord = {};
  // An object that will store an array representation of the gameWord
  $scope.GameController.gameWordArray = [];
  // An array that will hold the characters the user has correctly guessed
  $scope.GameController.guessedWordArray = [];
  // An array that will hold all the characters the user has already guessed
  $scope.GameController.allGuessedWordArray = [];
  // An array that will hold all the incorrect guesses the user has made
  $scope.GameController.incorrectGuessArray = [];
  // Define an integer for the number of guesses the user has remaining
  $scope.GameController.guessesRemaining = 6;
  // Define an integer for the number of correct guesses the user has made
  $scope.GameController.correctGuesses = 0;
  // Define the number of guesses the user will have in a game
  $scope.GameController.NO_GUESSES = 6;
  // A string to represent the user's guess input (for two way binding)
  $scope.GameController.userGuess = "";
  // A string that will display error messages for invalid input (for two way binding)
  $scope.GameController.errorMessage = "";


  /***************
   * Set up game *
   ***************/

  /**
   * Called when the user starts a new game.
   */
  $scope.GameController.configureGame = function() {
    console.log("Configuring game");
    $scope.GameController.getWord();
  };

  /**
   * Retrieves a random word and resets all game variables.
   */
  $scope.GameController.getWord = function() {    
    // Retrieve a word from the LinkedIn API via the server
    var word_resource = $resource('/game/get_word');
    $scope.GameController.gameWord = word_resource.get({}, function() {
      // Note: Uncomment to see game word for easier testing
      //console.log("Client: Retrieved word: ", $scope.GameController.gameWord.text);

    // Get the length of the word
    var wordLength = $scope.GameController.gameWord.text.length;

    // Populate an array that will hold the letters in the gameWord
    var gameWordArray = new Array();
    for (var i = 0; i < wordLength; i++) {
      gameWordArray[i] = $scope.GameController.gameWord.text.substring(i, i+1);
    }
    $scope.GameController.gameWordArray = gameWordArray;

    // Populate an array with hyphens that will hold the letters the user has guessed correctly
    var guessedWordArray = new Array();
    for (var i = 0; i < wordLength; i++) { 
      guessedWordArray[i] = "_";
    }
    $scope.GameController.guessedWordArray = guessedWordArray;

    //Define an integer for the number of guesses the user has remaining
    $scope.GameController.guessesRemaining = $scope.GameController.NO_GUESSES;
    //Define an integer for the number of correct guesses the user has made
    $scope.GameController.correctGuesses = 0;
    // Initialize an array to hold all the user's guesses (both correct and incorrect)
    $scope.GameController.allGuessedWordArray = new Array();
    // Initialize an array to hold all the user's incorrect guesses
    $scope.GameController.incorrectGuessArray = new Array();
    // Set game to on (for display purposes)
    $scope.GameController.gameIsOn = true;

    }, function errorHandling(err) {
        console.log(err);
    });
  };

  /*****************
   * Manage a game *
   *****************/

  /**
   * Called when the user submits a guess, evaluates the user's
   * guess input (from two-way binding) to determine if input is valid
   * and whether the guess is correct.
   */
  $scope.GameController.guess = function() {
    console.log("Client: guess() called");
    var guess = $scope.GameController.userGuess;

    //If the user entered an upper case letter, convert it to lower case
    guess = guess.toLowerCase();

    // Make sure the user entered a valid input
    if (guess.length > 1) {
      $scope.GameController.errorMessage = "Please guess only one letter at a time";
    } else if (guess.length < 1) {
      $scope.GameController.errorMessage = "Please enter at least one letter";
    } else {
      if ($scope.GameController.hasBeenGuessed(guess)) {
        $scope.GameController.errorMessage = "You already guessed that letter";
      } else {
        $scope.GameController.errorMessage = "";
        // If valid input, check if guess correct
        $scope.GameController.checkGuess(guess);
        // Check if the game is over
        if ($scope.GameController.gameIsOver()) {
          $scope.GameController.gameIsOn = false;
          // Code to end game
        }
      }
    }
    // Clear the guess entry field
    $scope.GameController.userGuess = "";
  };

  /**
   * Evaluates a valid user input to determine if the guess is correct.
   * @return true if guess correct
   * @return false if guess incorrect
   */
  $scope.GameController.checkGuess = function(guess) {
    var correctGuess = false;

    // Determine if user's guess matches letters in the game word
    for (var i = 0; i < $scope.GameController.gameWordArray.length; i++) {
      if ($scope.GameController.gameWordArray[i]===guess) {
        correctGuess = true;
        $scope.GameController.guessedWordArray[i] = guess;
        $scope.GameController.correctGuesses = $scope.GameController.correctGuesses + 1;
      }
    }

    // If the guess was incorrect, decrement the user's remaining guesses
    if (correctGuess !== true) {
      $scope.GameController.guessesRemaining = $scope.GameController.guessesRemaining -1;
      $scope.GameController.incorrectGuessArray.push(guess);
    }

    // Add the guessed letter to the array of all guesses
    $scope.GameController.allGuessedWordArray.push(guess);
  };

  /**
   * Evaluates the user's input to determine if the user has already guessed that letter.
   * @return true if user has already guessed that letter
   * @return false if user has not yet guessed that letter
   */
  $scope.GameController.hasBeenGuessed = function(guess) {
    if ($scope.GameController.allGuessedWordArray.includes(guess)) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Checks if the game is over.
   * @return true if game over
   * @return false if game not over
   */
  $scope.GameController.gameIsOver = function() {
    // Check if the player won
    if ($scope.GameController.correctGuesses == $scope.GameController.gameWordArray.length) {
      $scope.GameController.updateScore(1);
      $scope.GameController.playerWon = true;
      return true;
    }
    // Check if the player lost
    if ($scope.GameController.guessesRemaining == 0) {
      $scope.GameController.updateScore(0);
      $scope.GameController.playerWon = false;
      return true;
    }
    // Otherwise return false
    return false;
  };

  /**
   * Updates the user's lifetime score.
   */
  $scope.GameController.updateScore = function(outcome) {
    var score_resource = $resource('/game/update_score/:outcome', {outcome: outcome});
    score_resource.save({}, function() {
      $scope.main.saveSession();
    }, function errorHandling(err) {
      console.log(err);
    });
  };

  /**
   * Returns to the leaderboard/main menu.
   */
  $scope.GameController.toLeaderboard = function() {
    $location.path("/menu");
  };

  $scope.GameController.configureGame();
}]);

