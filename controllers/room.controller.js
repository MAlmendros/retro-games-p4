const { rooms } = require('../data/room.data');
const { users } = require('../data/user.data');

const createRoom = async(request, response) => {
    let newRoom = request.body;

    let selectedRoom = rooms.find((room) => room.name === newRoom.name);

    if (selectedRoom) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Ya existe una sala de juego con este nombre.`
            });
    } else if (!newRoom || !newRoom.name) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Rellene todos los datos.`
            });
    } else {
        const ids = rooms.map((room) => room.id);
        let id = Math.max(...ids) + 1;

        newRoom = {
            id,
            ...newRoom,
            limit: 2,
            players: []
        };
        rooms.push(newRoom);

        response.status(200).json(newRoom);
    }
}

const getRooms = async(request, response) => {
    response.status(200).json(rooms);
}

const getRoom = async(request, response) => {
    const id = request.params.id;

    const selectedRoom = rooms.find((room) => room.id === parseInt(id));

    if (selectedRoom) {
        response.status(200).json(selectedRoom);
    } else {
        response
            .status(404)
            .json({
                status: 404,
                message: `La sala de juego no existe.`
            });
    }
}

const updateRoom = async(request, response) => {
    const id = request.params.id;
    let updateRoom = request.body;

    let selectedRoom = rooms.find((room) => room.id === parseInt(id));

    if (!selectedRoom) {
        response
            .status(404)
            .json({
                status: 404,
                message: `La sala de juego que desea actualizar no existe`,
            })
    } else if (!updateRoom || !updateRoom.name) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Falta algún dato para poder actualizar la sala de juego.`
            });
    } else {
        updateRoom = {
            id: selectedRoom.id,
            ...updateRoom,
            limit: 2,
            players: [],
        };

        const iRoom = rooms.findIndex((room) => room.id === selectedRoom.id);
        rooms[iRoom] = updateRoom;

        response.status(200).json(updateRoom);
    }
}

const deleteRoom = async(request, response) => {
    const id = request.params.id;

    let selectedRoom = rooms.find((room) => room.id === parseInt(id));

    if (!selectedRoom) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario que desea eliminar no existe`,
            })
    } else {
        const iRoom = rooms.findIndex((room) => room.id === selectedRoom.id);
        rooms.splice(iRoom, 1);

        response.status(200).json(selectedRoom);
    }
}

const addPlayer = async(request, response) => {
    const { roomId, userId } = request.body;

    let selectedRoom = rooms.find((room) => room.id === parseInt(roomId));
    let selectedUser = users.find((user) => user.id === parseInt(userId));

    if (!selectedRoom) {
        response
            .status(404)
            .json({
                status: 404,
                message: `La sala de juego no existe.`
            });
    } else if (!selectedUser) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario no existe.`
            });
    } else {
        let selectedPlayer = selectedRoom.players.find((player) => player.id === selectedUser.id);

        let otherRoomUser = false;
        rooms.forEach(room => {
            const onRoom = room.players.find((player) => player.id === selectedUser.id);
            if (onRoom) {
                otherRoomUser = true;
            }
        });

        if (selectedPlayer) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El usuario "${selectedUser.username}" ya está en la sala "${selectedRoom.name}".`
                });
        } else if (!selectedPlayer && otherRoomUser) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El usuario "${selectedUser.username}" ya está en otra sala.`
                });
        } else if (selectedRoom.limit <= selectedRoom.players.length) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `La sala "${selectedRoom.name}" está llena.`
                });
        } else {
            selectedRoom.players.push(selectedUser);

            response.status(200).json(selectedRoom);
        }
    }
}

const removePlayer = async(request, response) => {
    const { roomId, userId } = request.body;

    let selectedRoom = rooms.find((room) => room.id === parseInt(roomId));
    let selectedUser = users.find((user) => user.id === parseInt(userId));

    if (!selectedRoom) {
        response
            .status(404)
            .json({ message: `La sala no existe.` });
    } else if (!selectedUser) {
        response
            .status(404)
            .json({ message: `El usuario no existe.` });
    } else {
        let newPlayers = selectedRoom.players.filter((player) => player.id !== selectedUser.id);
        selectedRoom.players = newPlayers;

        response.status(200).json(selectedRoom);
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
