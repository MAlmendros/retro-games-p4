const { Game } = require('../models/game.model');
const { Player } = require('../models/player.model');
const { Room } = require('../models/room.model');
const { User } = require('../models/user.model');

const { cells } = require('../data/cell.data');

const createGame = async(request, response) => {
    const { roomId, userId } = request.body;

    const selectedGame = await Game.findOne({ id: roomId });

    if (selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Ya existe un juego en la sala "${selectedGame.name}".`
            });
    } else if (!roomId || !userId) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Ha ocurrido un error al crear el juego.`
            });
    } else {
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
                    message: `El usuario no existe, revise sus credenciales.`
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
                let game = new Game({
                    id: room.id,
                    name: room.name
                });
                let returnPlayers = [{}, {}];
    
                await game.save();
    
                const users = await User.find({ room: room.id });
                const players = users && users.length ? users : [];
                const player = await Player.findOne({ id: userId });
                const iPlayer = players.findIndex((player) => player.id === userId);
    
                let returnPlayer = {};
                const valuesPlayer = {
                    id: players[iPlayer].id,
                    username: players[iPlayer].username,
                    avatar: players[iPlayer].avatar,
                    color: players[iPlayer].roomIndex === 0 ? '#007BFF' : '#DC3545',
                    cells: [],
                    score: 0,
                    game: game.id,
                    gameIndex: players[iPlayer].roomIndex
                };
                if (player) {
                    returnPlayer = await Player.findOneAndUpdate(
                        { id: userId }, valuesPlayer, { new: true }
                    );
                } else {
                    returnPlayer = new Player(valuesPlayer);
                    await returnPlayer.save();
                }
    
                returnPlayers[iPlayer] = returnPlayer;
    
                response.status(200).json({ ...game._doc, players: returnPlayers });
            } catch (error) {
                response
                    .status(404)
                    .json({ status: 404, message: `Ha ocurrido un error.` });
            }
        }
    }
}

const getGames = async(request, response) => {
    try {
        const games = await Game.find();
        let returnGames = [];

        for (const game of games) {
            const players = await Player.find({ game: game.id });
            const returnPlayers = players && players.length ? players : [];
            returnGames.push({ ...game._doc, players: returnPlayers });
        }

        response.status(200).json(returnGames);
    } catch (error) {
        response
            .status(404)
            .json({ status: 404, message: `Ha ocurrido un error.` });
    }
}

const getGame = async(request, response) => {
    const id = request.params.id;

    try {
        const game = await Game.findOne({ id });

        if (game) {
            const players = await Player.find({ game: game.id });
            const returnPlayers = players && players.length ? players : [];

            response.status(200).json({ ...game._doc, players: returnPlayers });
        } else {
            const room = await Room.findOne({ id });
    
            if (room) {
                response
                    .status(200)
                    .json({
                        status: 200,
                        message: `La sala está libre para jugar.`
                    })
            } else {
                response
                    .status(404)
                    .json({
                        status: 404,
                        message: `No existe esta sala de juego para jugar.`
                    });
            }
        }
    } catch (error) {
        response
            .status(404)
            .json({ status: 404, message: `Ha ocurrido un error.` });
    }
}

const updateGame = async(request, response) => {
    const id = request.params.id;
    const { roomId, userId } = request.body;

    const game = await Game.findOne({ id });

    if (!game) {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    } else if (roomId !== parseInt(game.id)) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Los datos del juego están corruptos.`
            });
    } else {
        try {
            let returnPlayers = [{}, {}];
    
            const users = await User.find({ room: roomId });
            const players = users && users.length ? users : [];
            const iPlayer = players.findIndex((player) => player.id === userId);
            const iRival = players.findIndex((player) => player.id !== userId);
            const player = await Player.findOne({ id: userId });
    
            let returnPlayer = {};

            const valuesPlayer = {
                id: players[iPlayer].id,
                username: players[iPlayer].username,
                avatar: players[iPlayer].avatar,
                color: players[iPlayer].roomIndex === 0 ? '#007BFF' : '#DC3545',
                cells: [],
                score: 0,
                game: game.id,
                gameIndex: players[iPlayer].roomIndex
            };

            if (player) {
                returnPlayer = await Player.findOneAndUpdate(
                    { id: userId }, valuesPlayer, { new: true }
                );
            } else {
                returnPlayer = new Player(valuesPlayer);
                await returnPlayer.save();
            }

            returnPlayers[iPlayer] = returnPlayer;
    
            if (iRival !== -1 ) {
                const rival = await Player.findOne({ id: players[iRival].id });

                let returnRival = {};
                const valuesRival = {
                    id: players[iRival].id,
                    username: players[iRival].username,
                    avatar: players[iRival].avatar,
                    color: players[iRival].roomIndex === 0 ? '#007BFF' : '#DC3545',
                    cells: [],
                    score: 0,
                    game: game.id,
                    gameIndex: players[iRival].roomIndex
                };

                if (rival) {
                    returnRival = await Player.findOneAndUpdate(
                        { id: players[iRival].id }, valuesRival, { new: true }
                    );
                } else {
                    returnRival = new Player(valuesRival);
                    await returnRival.save();
                }
        
                returnPlayers[iRival] = returnRival;
            }

            response.status(200).json({ ...game._doc, players: returnPlayers });
        } catch (error) {
            response
                .status(404)
                .json({ status: 404, message: `Ha ocurrido un error.` });
        }
    }
}

const deleteGame = async(request, response) => {
    const id = request.params.id;
    const { userId } = request.body;

    const game = await Game.findOne({ id });

    if (!game) {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    } else {
        const players = await Player.find({ game: game.id });
        const iPlayer = players.findIndex((player) => player.id === userId);
        const iRival = players.findIndex((player) => player.id !== userId);

        let returnPlayers = [{}, {}]
        returnPlayers[iPlayer] = players[iPlayer];

        if (iPlayer === -1) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El jugador no se encuentra en esta sala de juego.`
                });
        } else {
            await Player.deleteOne({ id: players[iPlayer].id });
            returnPlayers[iPlayer] = {};

            if (iRival === -1) {
                await Game.deleteOne({ id });

                response.status(200).json({
                    status: 200,
                    code: 'FINAL',
                    message: `Todos los jugadores han abandonado la sala y el juego ha sido eliminado.`
                });
            } else {
                returnPlayers[iRival] = players[iRival];

                const valuesRival = {
                    id: players[iRival].id,
                    username: players[iRival].username,
                    avatar: players[iRival].avatar,
                    color: players[iRival].color,
                    cells: [],
                    score: 0,
                    game: players[iRival].game,
                    gameIndex: players[iRival].gameIndex
                };

                returnRival = await Player.findOneAndUpdate(
                    { id: players[iRival].id }, valuesRival, { new: true }
                );

                response.status(200).json({
                    status: 200,
                    code: 'LEAVE',
                    game: { ...game._doc, players: returnPlayers }
                });
            }
        }
    }
}


const conquerCell = async(request, response) => {
    const id = request.params.id;
    const { userId, cellId } = request.body;

    const game = await Game.findOne({ id });

    if (!game) {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    } else {
        let player = await Player.findOne({ id: userId });

        if (!player) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El jugador no ha sido encontrado en la sala de juego.`
                });
        } else {
            const players = await Player.find({ game: game.id });
            const iPlayer = players.findIndex((player) => player.id === userId);
            const iRival = players.findIndex((player) => player.id !== userId);

            const controlRival = players[iRival].cells.includes(cellId);
            const controlPlayer = players[iPlayer].cells.includes(cellId);
            const controlLength = players[iPlayer].cells.length === 0;

            let controlAdjacent = players[iPlayer].cells.filter((cell) => cells[`${cell}`].includes(cellId)).length;
            
            if (controlRival) {
                response
                    .status(404)
                    .json({
                        status: 404,
                        message: `Esta celda ya ha sido conquistada por otro jugador.`
                    });
            } else if (controlPlayer) {
                response
                    .status(404)
                    .json({
                        status: 404,
                        message: `Esta celda ya ha sido conquistada por otro jugador.`
                    });
            } else if (!(controlLength || controlAdjacent)) {
                response
                    .status(404)
                    .json({
                        status: 404,
                        message: `Para conquistar esta celda necesitas tener en tu poder otra adyacente.`
                    });
            } else {
                const valuesPlayer = {
                    cells: [...player.cells, cellId],
                    score: player.score + 1
                }
                const returnPlayer = await Player.findOneAndUpdate(
                    { id: player.id }, valuesPlayer, { new: true }
                );

                const returnPlayers = [{}, {}];
                returnPlayers[iPlayer] = returnPlayer;
                returnPlayers[iRival] = players[iRival];
        
                response
                    .status(200)
                    .json({
                        game: { ...game._doc, players: returnPlayers },
                        cellId,
                        iPlayer: returnPlayer.gameIndex
                    });
            }
        }
    }
}

////////// Basic Users API Rest //////////
module.exports.createGame = createGame;
module.exports.getGames = getGames;
module.exports.getGame = getGame;
module.exports.updateGame = updateGame;
module.exports.deleteGame = deleteGame;

////////// Extended Users API Rest //////////
module.exports.conquerCell = conquerCell;
