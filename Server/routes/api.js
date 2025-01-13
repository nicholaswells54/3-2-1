const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// API key for Steam API (replace this with your own Steam API key)
const STEAM_API_KEY = '065CE0D049B923173B04846647E0224D';
const STEAM_USER_URL = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/';
const STEAM_USER_SUMMARY_URL = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/';

// Helper function to fetch Steam data
const fetchSteamUserData = async (steamUsername) => {
  try {
    // Step 1: Get Steam ID from the user's username
    const summaryResponse = await fetch(`${STEAM_USER_SUMMARY_URL}?key=${STEAM_API_KEY}&steamids=${steamUsername}`);
    const summaryData = await summaryResponse.json();
    const steamId = summaryData.response.players[0].steamid;

    // Step 2: Get the user's owned games
    const gamesResponse = await fetch(`${STEAM_USER_URL}?key=${STEAM_API_KEY}&steamid=${steamId}&format=json`);
    const gamesData = await gamesResponse.json();
    
    const gameDetails = gamesData.response.games.map(game => {
      return {
        name: game.name,
        genre: game.genre, // Assuming genre is available from the API (might need adjustments)
        playtime: game.playtime_forever // Total playtime in minutes
      };
    });

    // Step 3: Sort games based on playtime, or popularity, and group by genre
    gameDetails.sort((a, b) => b.playtime - a.playtime); // Sort by most played

    return gameDetails;

  } catch (error) {
    console.error('Error fetching Steam data:', error);
    return [];
  }
};

// Route to get game recommendations based on Steam username
router.get('/recommendations/:username', async (req, res) => {
  const { username } = req.params;

  const games = await fetchSteamUserData(username);

  if (games.length === 0) {
    return res.status(404).json({ message: 'No game data found for this user.' });
  }

  // Further filter and process the games data (e.g., based on most played genre)
  res.json(games); // Send the game recommendations back to the frontend
});

module.exports = router;
