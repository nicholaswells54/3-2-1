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
      // Simulate API calls for now - in real implementation, these would be actual Steam API calls
      // For demo purposes, I'll create mock data
      
      // Mock player data
      const mockPlayerData: PlayerSummary = {
        steamid: steamId,
        personaname: 'Demo Player',
        profileurl: `https://steamcommunity.com/id/${steamId}`,
        avatar: 'https://via.placeholder.com/32x32',
        avatarmedium: 'https://via.placeholder.com/64x64',
        avatarfull: 'https://via.placeholder.com/184x184'
      };

      // Mock games data
      const mockGames: GameData[] = [
        { appid: 730, name: 'Counter-Strike 2', playtime_forever: 1200, img_icon_url: '', genres: ['Action', 'FPS'] },
        { appid: 570, name: 'Dota 2', playtime_forever: 800, img_icon_url: '', genres: ['Strategy', 'MOBA'] },
        { appid: 440, name: 'Team Fortress 2', playtime_forever: 600, img_icon_url: '', genres: ['Action', 'FPS'] },
        { appid: 271590, name: 'Grand Theft Auto V', playtime_forever: 400, img_icon_url: '', genres: ['Action', 'Adventure'] },
        { appid: 292030, name: 'The Witcher 3', playtime_forever: 300, img_icon_url: '', genres: ['RPG', 'Adventure'] }
      ];

      setPlayerData(mockPlayerData);
      setGames(mockGames);
      
      // Calculate genre statistics
      const genreMap = new Map<string, { hours: number; gameCount: number }>();
      
      mockGames.forEach(game => {
        if (game.genres) {
          game.genres.forEach(genre => {
            const current = genreMap.get(genre) || { hours: 0, gameCount: 0 };
            genreMap.set(genre, {
              hours: current.hours + Math.round(game.playtime_forever / 60),
              gameCount: current.gameCount + 1
            });
          });
        }
      });

      const genreStatsArray: GenreStats[] = Array.from(genreMap.entries())
        .map(([genre, stats]) => ({ genre, ...stats }))
        .sort((a, b) => b.hours - a.hours);

      setGenreStats(genreStatsArray);
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
                  {games.slice(0, 5).map((game, index) => (
                    <ListItem key={game.appid}>
                      <ListItemText
                        primary={game.name}
                        secondary={`${formatHours(game.playtime_forever)} played`}
                      />
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
                  ))}
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
