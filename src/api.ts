// API utility for frontend to call backend
export async function fetchSteamProfile(steamId: string, apiKey: string) {
  const res = await fetch('/api/steam/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ steam_acc: steamId, steam_api_key: apiKey })
  });
  return res.json();
}

export async function fetchSteamRecommendations(genres: string[], ownedAppIds: number[], coopOnly: boolean) {
  const res = await fetch('/api/steam/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ genres, ownedAppIds, coopOnly })
  });
  return res.json();
}
