const { Player } = require('../models/player.model');
const { Room } = require('../models/room.model');
const { User } = require('../models/user.model');

const createRoom = async(request, response) => {
    const body = request.body;

    const selectedRoom = await Room.findOne({ name: body.name });

    if (selectedRoom) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Ya existe una sala de juego con este nombre.`
            });
    } else if (!body || !body.name) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Rellene todos los datos.`
            });
    } else {
        const rooms = await Room.find();
        const ids = rooms.map((room) => room.id);
        let id = ids.length ? Math.max(...ids) + 1 : 1;

        try {
            let room = new Room({
                id,
                name: body.name,
                limit: 2
            });

            await room.save();

            response.status(200).json({ ...room._doc, players: [] });
        } catch (error) {
            response
                .status(404)
                .json({ status: 404, message: `Ha ocurrido un error.` });
        }
    }
}

const getRooms = async(request, response) => {
    try {
        const rooms = await Room.find();
        let returnRooms = [];

        for (const room of rooms) {
            const users = await User.find({ room: room.id });
            const players = users && users.length ? users : [];

            returnRooms.push({ ...room._doc, players });
        }

        response.status(200).json(returnRooms);
    } catch (error) {
        response
            .status(404)
            .json({ status: 404, message: `Ha ocurrido un error.` });
    }
}

const getRoom = async(request, response) => {
    const id = request.params.id;

    try {
        const room = await Room.findOne({ id });

        if (!room) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `La sala de juego no existe.`
                });
        } else {
            const users = await User.find({ room: room.id });
            const players = users && users.length ? users : [];

            response.status(200).json({ ...room._doc, players });
        }
    } catch (error) {
        response
            .status(404)
            .json({ status: 404, message: `Ha ocurrido un error.` });
    }
}

const updateRoom = async(request, response) => {
    const id = request.params.id;
    const body = request.body;

    const room = await Room.findOne({ id });

    if (!room) {
        response
            .status(404)
            .json({
                status: 404,
                message: `La sala de juego que desea actualizar no existe.`,
            })
    } else if (!body || !body.name) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Falta algún dato para poder actualizar la sala de juego.`
            });
    } else {
        try {
            const updateValues = {
                id,
                ...body,
                limit: 2,
            };
    
            const updateRoom = await Room.findOneAndUpdate({ id }, updateValues, { new: true });
            const users = await User.find({ room: updateRoom.id });
            const players = users && users.length ? users : [];

            response.status(200).json({ ...updateRoom._doc, players });
        } catch (error) {
            response
                .status(404)
                .json({ status: 404, message: `Ha ocurrido un error.` });
        }
    }
}

const deleteRoom = async(request, response) => {
    const id = request.params.id;

    const room = await Room.findOne({ id });

    if (!room) {
        response
            .status(404)
            .json({
                status: 404,
                message: `La sala de juego que desea eliminar no existe.`,
            })
    } else {
        try {
            const users = await User.find({ room: room.id });
            const players = users && users.length ? users : [];
            const deleteRoom = { ...room._doc, players };

            await User.updateMany({ room: room.id }, { room: null }, { new: true });
            await Room.deleteOne({ id });

            response.status(200).json(deleteRoom);
        } catch (error) {
            response
                .status(404)
                .json({ status: 404, message: `Ha ocurrido un error.` });
        }
    }
}

const addPlayer = async(request, response) => {
    const { roomId, userId } = request.body;

    const room = await Room.findOne({ id: roomId });
    const user = await User.findOne({ id: userId });

    if (!room) {
        response
            .status(404)
            .json({
                status: 404,
                message: `La sala de juego no existe.`
            });
    } else if (!user) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario no existe.`
            });
    } else {
        if (user.room) {
            const message = user.room === room.id
                ? `El usuario "${user.username}" ya está en la sala "${room.name}".`
                : `El usuario "${user.username}" ya está en otra sala.`;
            response
                .status(404)
                .json({ status: 404, message });
        } else {
            let users = await User.find({ room: room.id });
            let players = users && users.length ? users : []; 

            if (room.limit <= players.length) {
                response
                    .status(404)
                    .json({
                        status: 404,
                        message: `La sala "${room.name}" está llena.`
                    });
            } else {
                try {
                    let roomIndex = 0;
                    if (players.length > 0) {
                        roomIndex = players[0].roomIndex === 0 ? 1 : 0;
                    }

                    await User.findOneAndUpdate({ id: userId }, { room: room.id, roomIndex }, { new: true });

                    users = await User.find({ room: room.id });
                    players = users && users.length ? users : [];

                    response.status(200).json({ ...room._doc, players });
                } catch (error) {
                    response
                        .status(404)
                        .json({ status: 404, message: `Ha ocurrido un error.` });
                }
            }
        }
    }
}

const removePlayer = async(request, response) => {
    const { roomId, userId } = request.body;

    const room = await Room.findOne({ id: roomId });
    const user = await User.findOne({ id: userId });

    if (!room) {
        response
            .status(404)
            .json({
                status: 404,
                message: `La sala no existe.`
            });
    } else if (!user) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario no existe.`
            });
    } else if (!user.room || user.room !== room.id) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario no se encuentra en esta sala de juego.`
            });
    } else {
        try {
            await User.findOneAndUpdate({ id: userId }, { room: null, roomIndex: -1 }, { new: true });
            await Player.findOneAndUpdate({ id: userId }, { game: null, gameIndex: -1 }, { new: true });

            const users = await User.find({ room: room.id });
            const players = users && users.length ? users : [];

            response.status(200).json({ ...room._doc, players });
        } catch (error) {
            response
                .status(404)
                .json({ status: 404, message: `Ha ocurrido un error.` });
        }
    }
}

////////// Basic Users API Rest //////////
module.exports.createRoom = createRoom;
module.exports.getRooms = getRooms;
module.exports.getRoom = getRoom;
module.exports.updateRoom = updateRoom;
module.exports.deleteRoom = deleteRoom;

////////// Extended Users API Rest //////////
module.exports.addPlayer = addPlayer;
module.exports.removePlayer = removePlayer;
