const { Room } = require('../models/room.model');
const { User } = require('../models/user.model');

const { cells } = require('../data/cell.data');
const { games } = require('../data/game.data');

const createGame = async(request, response) => {
    const { roomId, userId } = request.body;

    const game = games.find((game) => game.id === roomId);

    if (game) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Ya existe un juego en la sala "${game.name}".`
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

        let newGame = {
            id: room.id,
            name: room.name,
            players: [{}, {}]
        };

        if (!user) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El usuario no existe, revise sus credenciales.`
                });
        } else {
            const users = await User.find({ room: room.id });
            const players = users && users.length ? users : [];

            const iPlayer = players.findIndex((player) => player.id === userId);

            newGame.players[iPlayer] = {
                id: players[iPlayer].id,
                username: players[iPlayer].username,
                avatar: players[iPlayer].avatar,
                color: iPlayer === 0 ? '#007BFF' : '#DC3545',
                cells: [],
                score: 0
            };

            games.push(newGame);

            response.status(200).json(newGame);
        }
    }
}

const getGames = async(request, response) => {
    response.status(200).json(games);
}

const getGame = async(request, response) => {
    const gameId = request.params.id;
    const selectedGame = games.find((game) => game.id === parseInt(gameId));

    if (selectedGame) {
        response.status(200).json(selectedGame);
    } else {
        const room = await Room.findOne({ id: gameId });

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
                    message: `Ha ocurrido un error.`
                });
        }
    }
}

const updateGame = async(request, response) => {
    const gameId = request.params.id;
    const { roomId, userId } = request.body;

    const selectedGame = games.find((game) => game.id === parseInt(gameId));

    if (!selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    } else if (roomId !== parseInt(gameId)) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Los datos del juego están corruptos.`
            });
    } else {
        const room = await Room.findOne({ id: roomId });
        let updateGame = selectedGame;

        const users = await User.find({ room: roomId });
        const players = users && users.length ? users : [];

        const iPlayer = players.findIndex((player) => player.id === userId);
        updateGame.players[iPlayer] = {
            id: players[iPlayer].id,
            username: players[iPlayer].username,
            avatar: players[iPlayer].avatar,
            color: iPlayer === 0 ? '#007BFF' : '#DC3545',
            cells: [],
            score: 0,
        };


        let iGame = games.findIndex((game) => game.id === selectedGame.id);
        games[iGame] = updateGame;

        response.status(200).json(updateGame);
    }
}

const deleteGame = async(request, response) => {
    const gameId = request.params.id;
    const { userId } = request.body;

    const selectedGame = games.find((game) => game.id === parseInt(gameId));

    if (!selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    } else {
        const iPlayer = selectedGame.players.findIndex((player) => player.id === userId);
        const iRival = selectedGame.players.findIndex((player) => player.id !== userId);
        const iGame = games.findIndex((game) => game.id === selectedGame.id);

        if (iPlayer === -1 || iGame === -1) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `Ha ocurrido un error inesperado.`
                });
        } else {
            let updateGame = selectedGame;
            updateGame.players[iPlayer] = {};

            if (!updateGame.players[0].id && !updateGame.players[1].id) {
                games.splice(iGame, 1);

                response.status(200).json({
                    status: 200,
                    code: 'FINAL',
                    message: `Todos los jugadores han abandonado la sala y el juego ha sido eliminado.`
                });
            } else {
                updateGame.players[iRival] = {
                    ...updateGame.players[iRival],
                    cells: [],
                    score: 0
                };
                games[iGame] = updateGame;

                response.status(200).json({
                    status: 200,
                    code: 'LEAVE',
                    game: updateGame
                });
            }
        }
    }
}


const conquerCell = async(request, response) => {
    const gameId = request.params.id;
    const { userId, cellId } = request.body;

    const selectedGame = games.find((game) => game.id === parseInt(gameId));

    if (!selectedGame) {
        response
            .status(404)
            .json({
                status: 404,
                message: `No existe ningún juego en curso en esa sala de juego.`
            });
    } else {
        let selectedPlayer = selectedGame.players.find((player) => player.id === userId);

        if (!selectedPlayer) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El jugador no ha sido encontrado en la sala de juego.`
                });
        } else {
            const iPlayer = selectedGame.players.findIndex((player) => player.id === userId);
            const iRival = selectedGame.players.findIndex((player) => player.id !== userId);

            const controlRival = selectedGame.players[iRival].cells.includes(cellId);
            const controlPlayer = selectedGame.players[iPlayer].cells.includes(cellId);
            const controlLength = selectedGame.players[iPlayer].cells.length === 0;

            let controlAdjacent = selectedGame.players[iPlayer].cells.filter((cell) => cells[`${cell}`].includes(cellId)).length;
            
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
                let updateGame = selectedGame;
                updateGame.players[iPlayer] = {
                    ...selectedPlayer,
                    cells: [...selectedPlayer.cells, cellId],
                    score: selectedPlayer.score + 1
                };
        
                let iGame = games.findIndex((game) => game.id === selectedGame.id);
                games[iGame] = updateGame;

                response
                    .status(200)
                    .json({
                        game: updateGame,
                        cellId,
                        iPlayer
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
