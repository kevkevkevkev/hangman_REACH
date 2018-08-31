# Hangman

Hangman is a high stakes word game. The game selects a random word. The user attempts to guess the word. They have six guesses. If the user runs out of guesses, the hangman meets an unfortunate end.

Submitted by Kevin O’Connell for the LinkedIn REACH Coding Project.

## Getting Started


### Test the user experience and play a game of hangman
##### Step 1: Visit https://hangman-reach.herokuapp.com/
##### Step 2: Click register to create an account and get started.

### For more detailed testing, you can run this code on your local host. To do this:
##### Step 1: Open a terminal window
##### Step 2: Navigate to the directory in which you have saved the code on your computer
##### Step 3: Enter npm install package.json
##### Step 4: Open another terminal window and run mongod
##### Step 5: In the directory window, enter nodemon webServer.js
##### Step 6: Open your browser and enter in the address bar http://localhost:3000/

## Code Structure

I built this application using the MEAN stack. In thinking about the decomposition for my implementation, I identified three categories:
1) Handling retrieval of a random word from the LinkedIn REST API on the server
2) Managing the hangman game logic on the front-end
3) Storing information about the user's wins and losses in a Mongo database. 

#### 1) Server

##### Word Retrieval
I handled the retrieval of a random word on the server so there is a single point of access between my program and the LinkedIn API.

In this implementation, the server queries the LinkedIn API every time the user starts a new game. This results in a slight delay in loading the game. If I were to develop this project further, I would explore how to periodically query the LinkedIn API (e.g., once a day) in case of updates, and store the words retrieved in Mongo. I would also explore designing a word.js schema with properties to denote the “difficulty” level of each word.

##### Login, Registration, and Session
The server also handles login, registration, and the session. To create a persistent leaderboard, I wanted to offer users the ability to create an account that would keep track of their wins and losses. 

I added session handling so users could close the web application and return without having to log in again. 

#### 2) Front-end

##### Game Logic
I managed the hangman game logic on the front end because my implementation involves a number of arrays and other variables that are compared and modified each time the user guesses a word. It seemed easier to handle these variables locally, rather than processing a server request every time the user interacts with the game.

Because this implementation stores the game word locally, a committed user could find a way to hack the game. If I were to develop this project further, I could AB test an implementation where all the game logic is stored on the server and design tests to compare the performance.

#### Session
I used the Angular localStorageService package to save the user’s session locally. This way, the user can close the web application and return and remain logged in. If the user logs out, the localStorageService is cleared.

#### 3) Database

I used a Mongo database to store information about the users and their scores. I did this because, to populate a leaderboard, the information on users' wins and losses needs to persist across sessions. 

## Extensions

I added three categories of extension:
1) GUI
2) Leaderboard
3) Diagram

#### 1) GUI
I used a combination of html, css, and angular components to create a GUI. I designed this GUI with the goals of:
1. Making it clear to the user how to use the application. I aimed to design the application so a user with no prior knowledge could access the web-page, create an account, and start playing without needing to think about it.
2. Making it impossible for the user to “make a mistake.” I aimed to ensure that there were no “dead ends” or paths that the user could not return from. For example, I made the logo in the upper left a link that the user can click on at any time to return to the main menu.
3. Making it attractive. I used a simple color scheme (black, white, and grey) and applied a few precepts of Bauhaus design to try and make the application simple, clean, and attractive.

#### 1) Leaderboard
I implemented a leaderboard to display user scores. To do this, I added account login and registration functionality so the user can create an account that will persist across sessions.

I added two properties to the user.js schema: wins and losses. To appear on the leaderboard, the user must have at least 1 win or 1 loss. The users are displayed on the leaderboard in rank order of their wins.

For a more advanced implementation, I would add code to limit the leaderboard to a certain number of users. For example, it could be limited to the users with the top ten highest number of wins.

#### 3) Diagram
I added a diagram that can be drawn with 6 attempts that gets filled in as the user guesses incorrectly.

To implement this, I used Sketch to create 6 images. The first is of an empty scaffold, the last is of a fully drawn hangman. I saved these images as img resources. I used the angular “ng-if” directive to display one of the six images based on the number of guesses the user has remaining. 


## Other thoughts

The game is quite difficult in this implementation. If I were to develop further, I would explore how to let the user select a difficulty level. At first blush, the difficulty would seem to be in relation to the word's length. However, there are some strange three letter words in the API, such as 'aal' and ‘bey’. I think the difficulty is more related to how frequently words are used in everyday English.

I would scrape a reddit database or Google search information to develop a lexicon that stores information on the frequency of word usage. For words at a certain frequency and beyond a certain length I would categorize them in the easier category and ratchet up difficulty from there.  I would also consider removing “stop words”, that are so frequently used that they would not provide an interesting enough challenge to a player.