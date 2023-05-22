const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: [true, 'El nombre de usuario es un campo obligatorio.'],
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es un campo obligatorio.'],
        unique: [true, 'Este correo electrónico ya está registrado.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es un campo obligatorio.']
    },
    avatar: {
        type: String,
        required: [true, 'El avatar es un campo obligatorio.']
    },
    room: {
        type: Number,
        required: false
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
