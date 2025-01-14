document.addEventListener('DOMContentLoaded', () => {
    const gamesContainer = document.getElementById('games-container');
  
    // Fetch games from the backend
    fetch('/api/reload/action')  // Adjust the URL if needed (this will now work with the backend serving static files)
      .then(response => response.json())
      .then(games => {
        games.forEach(game => {
          const gameCard = createGameCard(game);
          gamesContainer.appendChild(gameCard);
        });
      })
      .catch(error => {
        console.error('Error fetching games:', error);
        gamesContainer.innerHTML = 'Failed to load games.';
      });
  });
  
  function createGameCard(game) {
    const card = document.createElement('div');
    card.classList.add('game-card');
  
    const gameImage = document.createElement('img');
    gameImage.src = game.imageUrl || 'https://via.placeholder.com/250'; // Fallback image if no image URL
    card.appendChild(gameImage);
  
    const gameTitle = document.createElement('h3');
    gameTitle.textContent = game.name;
    card.appendChild(gameTitle);
  
    const gameDescription = document.createElement('p');
    gameDescription.textContent = game.description;
    card.appendChild(gameDescription);
  
    const priceElement = document.createElement('p');
    if (game.isFreeToPlay) {
      priceElement.textContent = 'Free to Play';
      priceElement.classList.add('free-to-play');
    } else if (game.isDiscounted) {
      priceElement.innerHTML = `<span class="discount">Discounted Price: ${game.final_price}</span><br>Original Price: ${game.original_price}`;
    } else {
      priceElement.textContent = `Price: ${game.final_price}`;
    }
    card.appendChild(priceElement);
  
    const gameLink = document.createElement('a');
    gameLink.href = game.steamUrl;
    gameLink.target = '_blank';
    gameLink.textContent = 'View on Steam';
    card.appendChild(gameLink);
  
    return card;
  }
  