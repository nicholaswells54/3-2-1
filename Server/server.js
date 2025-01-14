// const express = require('express');
// const mongoose = require('mongoose');
// const axios = require('axios');
// const cors = require('cors');
// const { program } = require('commander');

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// mongoose.set('strictQuery', true)
// // Connect to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/gameRecommendationDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected...'))
//   .catch(err => console.log(err));

// // Define the Game model for MongoDB
// const gameSchema = new mongoose.Schema({
//   appId: Number,
//   name: String,
//   genre: String,
// });

// const Game = mongoose.model('Game', gameSchema);

// // Steam API URL
// const steamApiUrl = 'https://store.steampowered.com/api/getappsingenre';

// // Serve static files (index.html, CSS, JS) from the 'public' folder
// app.use(express.static('public'));

// // Fetch game details from Steam using the appId
// const fetchGameDetails = async (appId) => {
//   try {
//     const response = await axios.get(`https://store.steampowered.com/api/appdetails`, {
//       params: {
//         appids: appId,
//       },
//     });

//     const game = response.data[appId]?.data;

//     if (game) {
//       return {
//         appId: game.steam_appid,
//         name: game.name,
//         genre: game.genres ? game.genres.map(g => g.description).join(", ") : 'Unknown',
//       };
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error(`Error fetching game details for appId ${appId}:`, error);
//     return null;
//   }
// };

// const fetchGamesByGenre = async (genre) => {
//   try {
//     // Fetch data from the Steam API
//     const response = await axios.get(steamApiUrl, {
//       params: {
//         genre: genre, // Send genre as parameter
//       },
//     });

//     console.log('Response from Steam API:', JSON.stringify(response.data, null, 2)); // Log full response for debugging

//     // Check if the 'tabs' object exists in the response
//     if (!response.data || !response.data.tabs) {
//       throw new Error(`Tabs data not found in the response for genre: ${genre}`);
//     }

//     // Initialize an empty array to store game IDs
//     const gameIds = [];

//     // Safely check and add items from each tab
//     const tabs = response.data.tabs;

//     const addItemsFromTab = (tabName) => {
//       if (tabs[tabName] && Array.isArray(tabs[tabName].items)) {
//         console.log(`Adding items from ${tabName} tab.`);
//         gameIds.push(...tabs[tabName].items.map(item => item.id));
//       } else {
//         console.warn(`No 'items' array found in ${tabName} tab.`);
//       }
//     };

//     // Add items from each relevant tab
//     addItemsFromTab('newreleases');
//     addItemsFromTab('topsellers');
//     addItemsFromTab('comingsoon');
//     addItemsFromTab('specials');

//     // Check if any games were found
//     if (gameIds.length === 0) {
//       throw new Error(`No games found for genre: ${genre}`);
//     }

//     // Fetch detailed information for each game ID
//     const games = [];
//     for (const appId of gameIds) {
//       const gameDetails = await fetchGameDetails(appId);
//       if (gameDetails) {
//         games.push(gameDetails);
//       }
//     }

//     return games;
//   } catch (error) {
//     console.error('Error fetching games by genre:', error);
//     throw new Error('Failed to fetch games by genre');
//   }
// };

// // Function to reload the database with new games
// const reloadDatabase = async (genre) => {
//   try {
//     // Fetch games from Steam based on genre
//     const games = await fetchGamesByGenre(genre);

//     if (games.length === 0) {
//       console.log(`No games found for genre: ${genre}`);
//       return;
//     }

//     console.log(`Fetched ${games.length} games for genre: ${genre}`);

//     // Clear the existing games in the database for this genre
//     await Game.deleteMany({ genre: genre });

//     console.log(`Removed existing games for genre "${genre}".`);

//     // Insert new games into the database
//     const result = await Game.insertMany(games);

//     console.log(`Inserted ${result.length} games into the database.`);

//     console.log(`Database reloaded with ${games.length} games for genre "${genre}".`);
//   } catch (error) {
//     console.error('Error reloading the database:', error);
//   }
// };

// // Route to get all games from the database
// app.get('/games', async (req, res) => {
//   try {
//     const games = await Game.find();  // Find all games in the database
//     res.json(games);  // Send the games as JSON response
//   } catch (error) {
//     console.error('Error fetching games:', error);
//     res.status(500).send('Error fetching games');
//   }
// });

// // Create a CLI command to input genre and reload the database
// program
//   .command('reload <genre>')
//   .description('Reload the database with games of the specified genre')
//   .action(async (genre) => {
//     await reloadDatabase(genre);
//   });

// // Create a CLI command to terminate the server
// program
//   .command('terminate')
//   .description('Terminate the server')
//   .action(() => {
//     mongoose.connection.close(() => {
//       console.log('MongoDB connection closed.');
//       process.exit();
//     });
//   });

// // Parse CLI commands if any arguments are passed
// if (process.argv.length > 2) {
//   program.parse(process.argv);
// } else {
//   // If no command is passed, start the server
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// }

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const Game = require('./models/game'); // Assuming your Game model is in the 'models' folder

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/gameRecommendationDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Steam API key - replace this with your own API key

// Custom User-Agent header to bypass access restrictions
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'application/json',
};

// Function to fetch game details using the Steam API based on the game ID
const fetchGameDetails = async (gameId) => {
  try {
    const gameDetails = await axios.get(`https://api.steampowered.com/ISteamApps/GetAppDetails/v2?appids=${gameId}`, {
      headers: headers, // Pass the custom headers with the request
    });

    const gameData = gameDetails.data[gameId]?.data;

    if (!gameData) {
      console.log(`No data found for game ID: ${gameId}`);
      return null;
    }

    return {
      steamId: gameData.steam_appid.toString(), // Ensure steamId is a string
      name: gameData.name,
      description: gameData.short_description,
      imageUrl: gameData.header_image,
      steamUrl: `https://store.steampowered.com/app/${gameData.steam_appid}`,
      releaseDate: gameData.release_date ? new Date(gameData.release_date.date) : null,
      genre: gameData.genres ? gameData.genres.map(genre => genre.description) : [],
      price: gameData.price_overview ? gameData.price_overview.final_formatted : null,
      rating: gameData.metacritic ? gameData.metacritic.score : null,
      tags: gameData.tags ? gameData.tags.map(tag => tag.description) : [],
      isFreeToPlay: gameData.is_free_to_play || false,
      isDiscounted: gameData.price_overview ? gameData.price_overview.discount_percent > 0 : false,
      discountPercentage: gameData.price_overview ? gameData.price_overview.discount_percent : 0,
    };
  } catch (error) {
    console.error(`Error fetching game details for ID ${gameId}:`, error);
    return null;
  }
};

// Function to fetch games by genre and tab
const fetchGamesByTabAndGenre = async (tab, genre) => {
  try {
    const steamApiUrl = 'https://store.steampowered.com/api/featuredcategories/';
    const response = await axios.get(steamApiUrl, {
      params: {},  // No genre or tab here, you can filter after fetching the data
      headers: headers, // Pass the custom headers with the request
    });

    const categories = ['specials', 'topsellers', 'new_releases', 'coming_soon'];
    let gameIds = [];

    // Loop through the available categories and get games for the selected tab
    if (categories.includes(tab)) {
      const categoryData = response.data[tab];

      if (categoryData && Array.isArray(categoryData.items)) {
        gameIds = categoryData.items.map(item => item.id);
      }
    }

    if (gameIds.length === 0) {
      throw new Error(`No games found for tab: ${tab}`);
    }

    // Now, fetch game details for each game ID
    const games = [];
    for (const appId of gameIds) {
      const gameDetails = await fetchGameDetails(appId);
      if (gameDetails) {
        // Filter games by genre if the genre is provided
        if (genre) {
          if (gameDetails.genre.includes(genre)) {
            games.push(gameDetails);
          }
        } else {
          games.push(gameDetails);  // If no genre is specified, add all games
        }
      }
    }

    return games;
  } catch (error) {
    console.error('Error fetching games by tab and genre:', error);
    throw new Error('Failed to fetch games by tab and genre');
  }
};

// Function to save games to MongoDB
const saveGamesToDatabase = async (games) => {
  try {
    let totalGamesAdded = 0;
    let totalGamesUpdated = 0;

    for (const game of games) {
      console.log('Processing game:', game);  // Log game data before saving

      // Check if the game already exists based on steamId
      const existingGame = await Game.findOne({ steamId: game.steamId });

      if (!existingGame) {
        // Save the new game if it doesn't exist
        const newGame = new Game(game);
        await newGame.save();
        totalGamesAdded++;
        console.log(`Saved new game: ${game.name}`);
      } else {
        // If the game already exists, update the existing game instead of adding a new one
        console.log('Updating existing game:', game.steamId);

        // Update the game details without overwriting the createdAt field
        existingGame.name = game.name;
        existingGame.description = game.description;
        existingGame.imageUrl = game.imageUrl;
        existingGame.steamUrl = game.steamUrl;
        existingGame.releaseDate = game.releaseDate;
        existingGame.genre = game.genre;
        existingGame.price = game.price;
        existingGame.rating = game.rating;
        existingGame.tags = game.tags;
        existingGame.isFreeToPlay = game.isFreeToPlay;
        existingGame.isDiscounted = game.isDiscounted;
        existingGame.discountPercentage = game.discountPercentage;

        // Avoid modifying createdAt
        existingGame.createdAt = existingGame.createdAt; // Keep the original createdAt field

        await existingGame.save();
        totalGamesUpdated++;
        console.log(`Updated existing game: ${game.name}`);
      }
    }

    console.log(`Saved ${totalGamesAdded} new games and updated ${totalGamesUpdated} existing games.`);
  } catch (error) {
    console.error('Error saving/updating games to the database:', error);
  }
};

// Endpoint to reload games based on a tab and genre
app.get('/api/reload/:tab/:genre?', async (req, res) => {
  const { tab, genre } = req.params;

  try {
    console.log(`Fetching and saving games for tab: "${tab}" and genre: "${genre || 'all'}"`);

    // Fetch games for the specified tab and genre
    const games = await fetchGamesByTabAndGenre(tab, genre);
    console.log(`Fetched ${games.length} games for tab "${tab}" and genre "${genre || 'all'}"`);

    if (games.length === 0) {
      return res.status(404).json({ message: `No games found for tab "${tab}" and genre "${genre || 'all'}"` });
    }

    // Save fetched games to MongoDB
    await saveGamesToDatabase(games);

    // Fetch and return the saved games for that tab and genre
    const savedGames = await Game.find({ genre: genre || { $exists: true } });

    if (savedGames.length === 0) {
      return res.status(404).json({ message: `No saved games found for tab "${tab}" and genre "${genre || 'all'}"` });
    }

    res.status(200).json({
      message: `Games for tab "${tab}" and genre "${genre || 'all'}" have been reloaded.`,
      games: savedGames
    });
  } catch (error) {
    console.error('Error in /api/reload/:tab/:genre:', error);
    res.status(500).json({ error: `Failed to reload games for tab "${tab}" and genre "${genre || 'all'}"` });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});











