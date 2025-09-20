import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  FormControlLabel,
  Switch
} from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

interface GameData {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  genres?: string[];
}

interface GenreStats {
  genre: string;
  hours: number;
  gameCount: number;
}

interface PlayerSummary {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
}

interface GameRecommendation {
  appid: number;
  name: string;
  short_description: string;
  header_image: string;
  genres: string[];
  categories: string[];
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    final_formatted: string;
  };
}

interface SteamProfileProps {
  darkMode: boolean;
  onBack: () => void;
}

const SteamProfile: React.FC<SteamProfileProps> = ({ darkMode, onBack }) => {
  // On mount, fetch env vars from backend and skip input step if present
  useEffect(() => {
    fetch('/api/steam/env')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.steamId && data.apiKey) {
          setSteamId(data.steamId);
          setApiKey(data.apiKey);
        }
      })
      .catch(() => {});
  }, []);
  const [steamId, setSteamId] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [playerData, setPlayerData] = useState<PlayerSummary | null>(null);
  const [games, setGames] = useState<GameData[]>([]);
  const [genreStats, setGenreStats] = useState<GenreStats[]>([]);
  const [recommendations, setRecommendations] = useState<GameRecommendation[]>([]);
  const [showCoopOnly, setShowCoopOnly] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1); // 1: Input, 2: Profile, 3: Recommendations

  const fadeIn = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
  });

  const handleSteamIdSubmit = async () => {
    if (!steamId.trim() || !apiKey.trim()) {
      setError('Please enter both Steam ID and API Key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call backend to get Steam profile and games
      const res = await fetch('/api/steam/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ steamId: steamId, apiKey: apiKey })
      });
      const data = await res.json();
      console.log('Steam profile API response:', data);
      if (data.error) {
        setError(data.error);
        return;
      }
      const player = data.player;
      const gamesList = data.games || [];
      const games: GameData[] = gamesList.map((game: any) => ({
        appid: game.appid,
        name: game.name,
        playtime_forever: game.playtime_forever,
        img_icon_url: game.img_icon_url,
        genres: [] // Optionally fetch genres from another API if needed
      }));

      setPlayerData({
        steamid: player.steamid,
        personaname: player.personaname,
        profileurl: player.profileurl,
        avatar: player.avatar,
        avatarmedium: player.avatarmedium,
        avatarfull: player.avatarfull
      });
      setGames(games);
      setGenreStats([]);
      setStep(2);

    } catch (err) {
      setError('Failed to fetch Steam data. Please check your Steam ID and API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError('');

    try {
      // Mock recommendations based on top genres
      const mockRecommendations: GameRecommendation[] = [
        {
          appid: 1172470,
          name: 'Apex Legends',
          short_description: 'Battle royale shooter with unique characters',
          header_image: 'https://via.placeholder.com/460x215',
          genres: ['Action', 'FPS'],
          categories: ['Multi-player', 'Online Co-op'],
          price_overview: {
            currency: 'USD',
            initial: 0,
            final: 0,
            discount_percent: 0,
            initial_formatted: '',
            final_formatted: 'Free To Play'
          }
        },
        {
          appid: 1085660,
          name: 'Destiny 2',
          short_description: 'Online multiplayer action RPG',
          header_image: 'https://via.placeholder.com/460x215',
          genres: ['Action', 'RPG'],
          categories: ['Multi-player', 'Online Co-op'],
          price_overview: {
            currency: 'USD',
            initial: 0,
            final: 0,
            discount_percent: 0,
            initial_formatted: '',
            final_formatted: 'Free To Play'
          }
        },
        {
          appid: 1174180,
          name: 'Red Dead Redemption 2',
          short_description: 'Open world western adventure',
          header_image: 'https://via.placeholder.com/460x215',
          genres: ['Action', 'Adventure'],
          categories: ['Single-player', 'Multi-player'],
          price_overview: {
            currency: 'USD',
            initial: 5999,
            final: 2999,
            discount_percent: 50,
            initial_formatted: '$59.99',
            final_formatted: '$29.99'
          }
        }
      ];

      let filteredRecommendations = mockRecommendations;
      
      if (showCoopOnly) {
        filteredRecommendations = mockRecommendations.filter(game => 
          game.categories.includes('Online Co-op') || game.categories.includes('Co-op')
        );
      }

  console.log('Game recommendations:', filteredRecommendations);
  setRecommendations(filteredRecommendations);
  setStep(3);

    } catch (err) {
      setError('Failed to fetch game recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const formatHours = (minutes: number): string => {
    const hours = Math.round(minutes / 60);
    return hours === 1 ? '1 hour' : `${hours} hours`;
  };

  return (
    <animated.div style={fadeIn}>
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="2rem">
          <Typography variant="h4" component="h1">
            Steam Profile & Recommendations
          </Typography>
          <Button variant="outlined" onClick={onBack}>
            Back to Main
          </Button>
        </Box>

        {error && (
          <Alert severity="error" style={{ marginBottom: '1rem' }}>
            {error}
          </Alert>
        )}

        {/* Step 1: Input Steam ID and API Key */}
        {step === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Enter Your Steam Information
              </Typography>
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  label="Steam ID or Custom URL"
                  value={steamId}
                  onChange={(e) => setSteamId(e.target.value)}
                  margin="normal"
                  helperText="Enter your Steam ID (e.g., 76561198000000000) or custom URL"
                />
                <TextField
                  fullWidth
                  label="Steam API Key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  margin="normal"
                  helperText="Get your API key from https://steamcommunity.com/dev/apikey"
                />
                <Box marginTop="1rem">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSteamIdSubmit}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Analyze Profile'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Profile Analysis */}
        {step === 2 && playerData && (
          <Box>
            <Card style={{ marginBottom: '2rem' }}>
              <CardContent>
                <Box display="flex" alignItems="center" marginBottom="1rem">
                  <img 
                    src={playerData.avatarmedium} 
                    alt="Profile" 
                    style={{ marginRight: '1rem', borderRadius: '4px' }}
                  />
                  <Box>
                    <Typography variant="h6">{playerData.personaname}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Steam ID: {playerData.steamid}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card style={{ marginBottom: '2rem' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gaming Profile Analysis
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Based on {games.length} games in your library
                </Typography>
                
                <Box marginTop="2rem">
                  <Typography variant="subtitle1" gutterBottom>
                    Top Genres by Playtime
                  </Typography>
                  {genreStats.slice(0, 5).map((genre, index) => (
                    <Box key={genre.genre} marginBottom="1rem">
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">
                          {genre.genre}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {genre.hours}h ({genre.gameCount} games)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(genre.hours / genreStats[0].hours) * 100}
                        style={{ marginTop: '4px' }}
                      />
                    </Box>
                  ))}
                </Box>

                <Divider style={{ margin: '2rem 0' }} />

                <Typography variant="subtitle1" gutterBottom>
                  Most Played Games
                </Typography>
                <List>
                    {games
                        .slice() // create a shallow copy
                        .sort((a, b) => b.playtime_forever - a.playtime_forever) // sort descending
                        .slice(0, 5)
                        .map((game, index) => (
                            <ListItem key={game.appid}>
                                <Box display="flex" alignItems="center">
                                <img
                                    src={`https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                                    alt={game.name}
                                    style={{ width: 32, height: 32, marginRight: 12, borderRadius: 4 }}
                                />
                                <ListItemText
                                    primary={game.name}
                                    secondary={`${formatHours(game.playtime_forever)} played`}
                                />
                                </Box>
                                <Box>
                                {game.genres?.map((genre) => (
                                    <Chip
                                    key={genre}
                                    label={genre}
                                    size="small"
                                    style={{ margin: '2px' }}
                                    />
                                ))}
                                </Box>
                            </ListItem>
                        )
                    )}
                </List>

                <Box marginTop="2rem">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showCoopOnly}
                        onChange={(e) => setShowCoopOnly(e.target.checked)}
                      />
                    }
                    label="Show only co-op games"
                  />
                </Box>

                <Box marginTop="2rem">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGetRecommendations}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Get Game Recommendations'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Step 3: Recommendations */}
        {step === 3 && (
          <Box>
            <Card style={{ marginBottom: '2rem' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recommended Games
                  {showCoopOnly && ' (Co-op Only)'}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Based on your gaming preferences and library analysis
                </Typography>
              </CardContent>
            </Card>

            <Grid container spacing={2}>
              {recommendations.map((game) => (
                <Grid item xs={12} md={6} key={game.appid}>
                  <Card>
                    <img
                      src={game.header_image}
                      alt={game.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {game.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {game.short_description}
                      </Typography>
                      
                      <Box marginTop="1rem" marginBottom="1rem">
                        {game.genres.map((genre) => (
                          <Chip
                            key={genre}
                            label={genre}
                            size="small"
                            style={{ margin: '2px' }}
                          />
                        ))}
                      </Box>

                      <Box marginTop="1rem" marginBottom="1rem">
                        {game.categories.map((category) => (
                          <Chip
                            key={category}
                            label={category}
                            size="small"
                            variant="outlined"
                            style={{ margin: '2px' }}
                          />
                        ))}
                      </Box>

                      {game.price_overview && (
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" color="primary">
                            {game.price_overview.final_formatted}
                          </Typography>
                          {game.price_overview.discount_percent > 0 && (
                            <Box>
                              <Chip
                                label={`-${game.price_overview.discount_percent}%`}
                                color="secondary"
                                size="small"
                              />
                              <Typography
                                variant="body2"
                                style={{ textDecoration: 'line-through', marginLeft: '8px' }}
                              >
                                {game.price_overview.initial_formatted}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box marginTop="2rem" display="flex" gap="1rem">
              <Button
                variant="outlined"
                onClick={() => setStep(2)}
                fullWidth
              >
                Back to Profile
              </Button>
              <Button
                variant="contained"
                onClick={handleGetRecommendations}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Refresh Recommendations'}
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </animated.div>
  );
};

export default SteamProfile;
