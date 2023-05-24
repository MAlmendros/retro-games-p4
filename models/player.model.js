const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: [true, 'El nombre es un campo obligatorio.'],
    },
    avatar: {
        type: String,
        required: [true, 'El avatar es un campo obligatorio.']
    },
    color: {
        type: String,
        required: [true, 'El color es un campo obligatorio.']
    },
    cells: {
        type: Array,
        required: false
    },
    score: {
        type: Number,
        required: [true, 'El marcador es un campo obligatorio.']
    },
    game: {
        type: Number,
        required: false
    }
});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = { Player };
