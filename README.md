  Game Genre Search Function
  A simple application to search for video games based on genre using the public Steam web API (https://github.com/Revadike/InternalSteamWebAPI/wiki). 
  
  The backend is powered by Express.js and Axios, and the frontend uses HTML, CSS, and JavaScript to fetch and display the results dynamically.

Features
  Search games by genre (e.g., action, horror, adventure).
  
  Display details of games, including: Game name, Description, Genre, Price, Number of ratings, Rating, Steam link. (Example of structured output array can be found below)
    
  The frontend and backend are hosted together on the same server.
    Tech Stack and dependencies are listed below:
    
  Backend: Node.js, Express.js
    Frontend: HTML, CSS, JavaScript
    API: Steam Web API (used to fetch game details)
    HTTP Client: Axios for making requests to the Steam API

Installation
Follow these steps to run the project locally:

Step 1:
Clone the Repository
   
      git clone https://github.com/nicholaswells54/3-2-1/tree/server-branch
      
      cd server

Step 2:
Install Dependencies
Make sure you have Node.js installed (https://nodejs.org/en). Then, install the required dependencies by running:

    npm install
    
This will install the following dependencies:

express - Web framework for Node.js

axios - Promise-based HTTP client for making API requests

path - Node.js module to handle file paths

Step 3:
 Set Up the Static File Directory
The frontend files (HTML, CSS, JavaScript) are served from a public directory. Make sure your index.html file and other frontend assets are in a public folder.

   File Structure:

    Server/
    │
    ├── public/
    │   └── index.html      # Frontend HTML file
    │   └── style.css       # CSS file (optional)
    │   └── app.js          # Frontend JavaScript file
    │
    ├── server.js           # Express.js backend file
    ├── package.json        # Node.js dependencies and scripts
    └── README.md           # This file


Step 4:
Start the Server
To start the server, run the following command:

    npm start
  or run the command below in the server folder directory:

    node server.js

  Console should have the following output in the terminal
  
    Server is running on port 5000
  
The server should now be running on port 5000 (or another port if specified in the environment variables).

Step 5:
Access the Application
Once the server is running, open your browser and navigate to:
    
    http://localhost:5000

Step 7:
Usage
Enter a game genre in the input field (e.g., "action", "horror", "adventure").
Click the "Search Games" button.
The application will display a list of games matching the genre, showing their name, description, price, rating, and a link to their Steam page.

Here is some information for integration into a custom frontend:


API Endpoint
The backend exposes a REST API that fetches games based on a specified genre:
GET /api/reload/:genre: Fetches a list of games for the given genre (replace :genre with the genre you want to search, e.g., action, adventure).

    http://localhost:5000/api/reload/:genre:

Response Example:

    {
      "message": "Found 5 games for genre 'Action'.",
      "games": [
        {
          "name": "Game 1",
          "description": "An exciting action game.",
          "genre": ["Action"],
          "imageUrl": "https://example.com/game1.jpg",
          "steamUrl": "https://store.steampowered.com/app/12345",
          "price": "$19.99",
          "rating": "85"
        },
        (more games) ...
      ]
    }

  
  Error Response Example (if no games are found):

  
    {
      "message": "No games found for genre: action"
    }
