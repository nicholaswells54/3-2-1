const express = require('express');
const axios = require('axios');
const path = require('path');  // Import path module for handling file paths
const { json } = require('stream/consumers');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to fetch games by genre
const fetchGamesByGenre = async (genre) => {
  try {
    // Fetch game IDs based on the genre
    const response = await axios.get(`https://store.steampowered.com/api/getappsingenre/?genre=${genre}&cc=us&l=english`);
    
    if (!response.data.tabs || !response.data.tabs.topsellers || !response.data.tabs.topsellers.items) {
      throw new Error(`No games found for genre: ${genre}`);
    }

    const gameIds = response.data.tabs.topsellers.items.map(item => item.id);
    
    // Fetch game details for each game ID, including reviews
    const gameDetailsPromises = gameIds.map(id => fetchGameDetails(id));
    let gameDetails = await Promise.all(gameDetailsPromises);

    // Fetch reviews for each game and attach them to the game details
    for (let game of gameDetails) {
      if (game) {
        const reviews = await fetchGameReviews(game.steamId);
        game.reviews = reviews;
      }
    }

    // Sort games by number of reviews, from most to least
    gameDetails = gameDetails.filter(game => game !== null);  // Remove null values
    gameDetails.sort((a, b) => b.reviews - a.reviews);  // Sort by number of reviews

    return gameDetails;
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
};

// Function to fetch game details using the Steam API
const fetchGameDetails = async (gameId) => {
  try {
    const response = await axios.get('https://store.steampowered.com/api/appdetails', {
      params: { appids: gameId }
    });

    const gameData = response.data[gameId]?.data;
    if (!gameData) {
      return null;  // Skip if no game data is found
    }

    return {
      steamId: gameData.steam_appid.toString(),
      name: gameData.name,
      description: gameData.short_description,
      imageUrl: gameData.header_image,
      steamUrl: `https://store.steampowered.com/app/${gameData.steam_appid}`,
      releaseDate: gameData.release_date ? new Date(gameData.release_date.date) : null,
      genre: gameData.genres ? gameData.genres.map(genre => genre.description) : [],
      price: gameData.price_overview ? gameData.price_overview.final_formatted : null,
      rating: gameData.metacritic ? gameData.metacritic.score : null,
      isFreeToPlay: gameData.is_free_to_play || false,
      isDiscounted: gameData.price_overview ? gameData.price_overview.discount_percent > 0 : false,
      discountPercentage: gameData.price_overview ? gameData.price_overview.discount_percent : 0,
    };
  } catch (error) {
    console.error(`Error fetching details for game ID ${gameId}:`, error);
    return null;  // Skip if an error occurs
  }
};

// Function to fetch game reviews from Steam API
const fetchGameReviews = async (appId) => {
  try {
    const response = await axios.get(`https://store.steampowered.com/appreviews/${appId}`, {
      params: {
        json: 1
      }
    });

    if (response.data.success && response.data.query_summary) {
      return response.data.query_summary.total_reviews;  // Return the total number of reviews
    }

    return 0;  // Return 0 if no reviews found or there was an error
  } catch (error) {
    console.error(`Error fetching reviews for game ID ${appId}:`, error);
    return 0;  // Return 0 if an error occurs
  }
};

// Endpoint to reload games based on the selected genre
app.get('/api/reload/:genre', async (req, res) => {
  const genre = req.params.genre;
  
  try {
    const games = await fetchGamesByGenre(genre);
    
    if (games.length === 0) {
      return res.status(404).json({ message: `No games found for genre: ${genre}` });
    }

    res.status(200).json({
      message: `Found ${games.length} games for genre "${genre}".`,
      games: games,
    });
  } catch (error) {
    console.error('Error in /api/reload/:genre:', error);
    res.status(500).json({ message: 'Failed to fetch games. Please try again later.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});










