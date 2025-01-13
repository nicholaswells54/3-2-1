const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  vote: { type: Boolean, required: true }, // True for "Yes", False for "No"
});

module.exports = mongoose.model('Vote', voteSchema);
