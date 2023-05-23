const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
});

const Game = mongoose.model('Game', GameSchema);

module.exports = { Game };
