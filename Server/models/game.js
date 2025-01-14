const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  steamId: { 
    type: Number,  // Use Number for steamId instead of String
    required: true, 
    unique: true, // Ensures that each game has a unique Steam app ID
  },
  name: { 
    type: String, 
    required: true, 
  },
  description: { 
    type: String, 
    required: false, 
  },
  imageUrl: { 
    type: String, 
    required: false, 
  },
  steamUrl: { 
    type: String, 
    required: true, // Each game should have a Steam store URL
  },
  releaseDate: { 
    type: Date, 
    required: false, 
  },
  genre: { 
    type: [String], // Store genres as an array of strings
    required: false, 
  },
  price: { 
    type: String, // Could be formatted as 'USD 19.99' or other currency
    required: false,
  },
  rating: { 
    type: Number, // Game rating out of 10 or another rating scale
    required: false,
  },
  tags: { 
    type: [String], // Tags for additional game categorization (e.g., 'Multiplayer', 'Singleplayer')
    required: false,
  },
  isFreeToPlay: { 
    type: Boolean, 
    required: false, 
    default: false, // If the game is free-to-play
  },
  isDiscounted: { 
    type: Boolean, 
    required: false, 
    default: false, // If the game is on sale or has a discount
  },
  discountPercentage: { 
    type: Number, 
    required: false, 
    default: 0, // Discount 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, // Timestamp when the game was added to the database
  },
});

// Create a Game model based on the schema
const Game = mongoose.model('game', gameSchema);

module.exports = Game;
