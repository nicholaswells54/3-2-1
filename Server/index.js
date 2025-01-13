const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const { program } = require('commander');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/gameRecommendationDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Define the Game model for MongoDB
const gameSchema = new mongoose.Schema({
  appId: Number,
  name: String,
  genre: String,
});

const Game = mongoose.model('Game', gameSchema);

// Steam API URL
const steamApiUrl = 'https://store.steampowered.com/api/getappsingenre';

// Fetch game details from Steam using the appId
const fetchGameDetails = async (appId) => {
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails`, {
      params: {
        appids: appId,
      },
    });

    const game = response.data[appId]?.data;

    if (game) {
      return {
        appId: game.steam_appid,
        name: game.name,
        genre: game.genres ? game.genres.map(g => g.description).join(", ") : 'Unknown',
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching game details for appId ${appId}:`, error);
    return null;
  }
};

const fetchGamesByGenre = async (genre) => {
  try {
    // Fetch data from the Steam API
    const response = await axios.get(steamApiUrl, {
      params: {
        genre: genre, // Send genre as parameter
      },
    });

    console.log('Response from Steam API:', JSON.stringify(response.data, null, 2)); // Log full response for debugging

    // Check if the 'tabs' object exists in the response
    if (!response.data || !response.data.tabs) {
      throw new Error(`Tabs data not found in the response for genre: ${genre}`);
    }

    // Initialize an empty array to store game IDs
    const gameIds = [];

    // Safely check and add items from each tab
    const tabs = response.data.tabs;

    const addItemsFromTab = (tabName) => {
      if (tabs[tabName] && Array.isArray(tabs[tabName].items)) {
        console.log(`Adding items from ${tabName} tab.`);
        gameIds.push(...tabs[tabName].items.map(item => item.id));
      } else {
        console.warn(`No 'items' array found in ${tabName} tab.`);
      }
    };

    // Add items from each relevant tab
    addItemsFromTab('newreleases');
    addItemsFromTab('topsellers');
    addItemsFromTab('comingsoon');
    addItemsFromTab('specials');

    // Check if any games were found
    if (gameIds.length === 0) {
      throw new Error(`No games found for genre: ${genre}`);
    }

    // Fetch detailed information for each game ID
    const games = [];
    for (const appId of gameIds) {
      const gameDetails = await fetchGameDetails(appId);
      if (gameDetails) {
        games.push(gameDetails);
      }
    }

    return games;
  } catch (error) {
    console.error('Error fetching games by genre:', error);
    throw new Error('Failed to fetch games by genre');
  }
};


// Function to reload the database with new games
const reloadDatabase = async (genre) => {
  try {
    // Fetch games from Steam based on genre
    const games = await fetchGamesByGenre(genre);

    // Clear the existing games in the database for this genre
    await Game.deleteMany({ genre: genre });

    // Insert new games into the database
    await Game.insertMany(games);

    console.log(`Database reloaded with ${games.length} games for genre "${genre}".`);
  } catch (error) {
    console.error('Error reloading the database:', error);
  }
};

// Function to gracefully shut down the server
const terminateServer = () => {
  console.log('Terminating server...');

  // Close the MongoDB connection
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
  });
};

// Create a CLI command to input genre and reload the database
program
  .command('reload <genre>')
  .description('Reload the database with games of the specified genre')
  .action(async (genre) => {
    await reloadDatabase(genre);
  });

// Create a CLI command to terminate the server
program
  .command('terminate')
  .description('Terminate the server')
  .action(() => {
    terminateServer();
  });

// Parse CLI commands
program.parse(process.argv);

// Start the server only if no CLI command was passed
if (process.argv.length <= 2) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
