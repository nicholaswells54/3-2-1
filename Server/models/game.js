const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  steamId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  steamUrl: { type: String },
});

module.exports = mongoose.model('Game', gameSchema);
