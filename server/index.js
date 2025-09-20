import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Helper to get env or request value
function getEnvOrReq(key, req) {
  return process.env[key] || req.body[key.toLowerCase()];
}

// Get Steam profile and games
app.post('/api/steam/profile', async (req, res) => {
  const steamId = getEnvOrReq('STEAM_ACC', req);
  const apiKey = getEnvOrReq('STEAM_API_KEY', req);
  console.log("Using Steam ID and API Key:", steamId, apiKey);

  if (!steamId || !apiKey) {
    return res.status(400).json({ error: 'Steam ID and API Key required.' });
  }

  try {
    // Get player summary
    const summaryUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`;
    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();
    const player = summaryData.response.players[0];

    // Get owned games
    const gamesUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;
    const gamesRes = await fetch(gamesUrl);
    const gamesData = await gamesRes.json();
    const games = gamesData.response.games || [];

    res.json({ player, games });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Steam data.' });
  }
});

// Get recommendations (stub, to be improved)
app.post('/api/steam/recommend', async (req, res) => {
  // Accept genres, owned appids, co-op filter
  const { genres, ownedAppIds, coopOnly } = req.body;
  // TODO: Implement Steam store search and filtering
  res.json({ recommendations: [] });
});


// Endpoint to provide env vars to frontend
app.get('/api/steam/env', (req, res) => {
  const steamId = process.env.STEAM_ACC || '';
  const apiKey = process.env.STEAM_API_KEY || '';
  res.json({ steamId, apiKey });
});

app.listen(PORT, () => {
  console.log(`Steam backend running on port ${PORT}`);
});
