const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'El nombre de la sala de juego es un campo obligatorio.']
    },
    limit: {
        type: Number,
        required: [true, 'El límite de jugadores en la sala de juego es un campo obligatorio.']
    }
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = { Room };
