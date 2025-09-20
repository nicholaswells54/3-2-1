## Steam Profile & Game Recommendation Feature Context (as of September 20, 2025)

### User Requirements

- Build a web app feature that:
	- Pulls in Steam user data using the Steam API and a user-provided Steam API key.
	- Analyzes the user's library to find games they enjoy, generating a profile that includes hours played per genre.
	- Uses this profile to recommend relevant games from the Steam store (not already owned), with a filter for online co-op games.
	- Integrates this feature into the current web app, accessible via a button on the landing page.
	- Stores the Steam API key in a `.env` file, which is gitignored to avoid exposing sensitive information.

### Implementation Notes

- **Steam API Usage:**
	- Requires user SteamID and API key.
	- Endpoints needed: GetOwnedGames, GetPlayerSummaries, and Steam Store API for recommendations.
	- Genre classification may require mapping Steam appIDs to genres (not always directly available via API).

- **Profile Generation:**
	- Aggregate hours played by genre.
	- Identify top genres and preferences.

- **Game Recommendation:**
	- Query Steam store for games matching top genres, excluding owned games.
	- Filter results for online co-op capability (may require parsing tags or categories from store data).

- **Integration:**
	- Add a button to the landing page to access this feature.
	- UI/UX for API key input, profile display, and recommendations list.

- **Security:**
	- Store API key in `.env` (ensure `.env` is in `.gitignore`).
	- Never expose API key in client-side code or public repo.

### Potential Oversights & Considerations

- **Steam API Rate Limits:**
	- Be aware of request limits and error handling for failed API calls.

- **User Authentication:**
	- May need to verify Steam ownership or handle private profiles.

- **Genre Mapping:**
	- Steam API may not provide genre info directly; may need to use third-party datasets or scrape store pages.

- **Store API Limitations:**
	- Steam Store API is unofficial and may change; consider fallback strategies.

- **Data Privacy:**
	- Handle user data securely; inform users about data usage.

- **Frontend/Backend Split:**
	- API key and sensitive requests should be handled server-side, not exposed to frontend.

- **Error Handling:**
	- Robust handling for missing data, API failures, and edge cases (e.g., empty libraries).

- **Testing:**
	- Test with various Steam accounts (public/private, large/small libraries).

- **Internationalization:**
	- Consider language/region differences in game data and recommendations.

---
This context should be referenced for all future iterations of the Steam profile and recommendation feature.
# 