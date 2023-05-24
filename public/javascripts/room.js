const roomPlayer = document.querySelectorAll('.player');
const roomPlayerName = document.querySelectorAll('.player-name');
const roomPlayerImg = document.querySelectorAll('.player-img');
const roomPlayerInfo = document.querySelector('.player-info');
const roomPlayerScore = document.querySelectorAll('.player-score');
const roomButtonLeave = document.querySelector('.button-leave');
const roomBoard = document.querySelector('.room-board');

const colors = ['blue', 'red'];

const socket = io();

if (window.localStorage.getItem('retroGamesUser') === null) {
    redirectTo('/login');
} else {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    
    if (!userInfo.room || !userInfo.room.id) {
        redirectTo();
    } else {
        checkGame(userInfo);
    }
}

function redirectTo(path = '/') {
    window.location.href = path;
}

var canvasList = document.querySelectorAll('.cell canvas');

canvasList.forEach((canvas, index) => {
    const context = canvas.getContext('2d');
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', (event) => {
        conquerCell(index + 1);
    });
});

function checkGame(userInfo) {
    fetch(`/api/games/${userInfo.room.id}`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type':  'application/json' })          
    })
    .then(data => data.json()) 
    .then(response => {
        if (!response || (response.status && response.status !== 200)) {
            redirectTo();
        }
        else {
            if (response.status === 200) {
                createGame(userInfo);
            } else {
                updateGame(userInfo);
            }
        }
    })
    .catch(error => {
        redirectTo();
    });
}

function createGame(userInfo) {
    const body = {
        roomId: userInfo.room.id,
        userId: userInfo.id
    };

    fetch('/api/games', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' }) 
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.status && response.status !== 200) {
            redirectTo();
        }
        else {
            socket.emit(`start-${userInfo.room.id}`, (response));
        }
    })
    .catch(error => {
        redirectTo();
    });
}

function updateGame(userInfo) {
    const body = {
        roomId: userInfo.room.id,
        userId: userInfo.id
    };

    fetch(`/api/games/${userInfo.room.id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' }) 
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.status && response.status !== 200) {
            redirectTo();
        }
        else {
            socket.emit(`start-${userInfo.room.id}`, (response));
        }
    })
    .catch(error => {
        redirectTo();
    });
}

function conquerCell(cellId) {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));

    const body = {
        userId: userInfo.id,
        cellId
    };

    fetch(`/api/games/${userInfo.room.id}/conquer-cell`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' }) 
    })
    .then(data => data.json()) 
    .then(response => {
        if (!response.status) {
            socket.emit(`game-${userInfo.room.id}`, (response));
        }
    })
    .catch(error => {
        redirectTo();
    });
}

document.getElementById('btn-leave').addEventListener('click', () => {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    const body = { roomId: userInfo.room.id, userId: userInfo.id };
    const gameId = userInfo.room.id;

    fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' })          
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.code && response.code === 'FINAL') {
            redirectTo();
        } else if (response.code && response.code === 'LEAVE') {
            socket.emit(`start-${userInfo.room.id}`, response.game);
            redirectTo();
        }
    })
    .catch(error => {});
});

const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));

socket.on(`start-${userInfo.room.id}`, (game) => {
    let playersCount = 0;

    roomBoard.classList.add('d-none');
    roomPlayerInfo.innerHTML = 'Esperando a tu rival...';
    roomPlayerScore[0].innerHTML = `0 (0%)`;
    roomPlayerScore[1].innerHTML = `0 (0%)`;

    let playerA = null;
    let playerB = null;

    if (game && game.players) {
        playerA = game.players.find((player) => player.gameIndex === 0);
        playerB = game.players.find((player) => player.gameIndex === 1);
    }

    if (playerA) {
        roomPlayerName[0].innerHTML = playerA.username;
        document.getElementById('avatar-0').setAttribute('src', '/images/' + playerA.avatar + '.jpg');
        roomPlayer[0].classList.remove('d-none');
        playersCount++;
    } else {
        roomPlayerName[0].innerHTML = 'Jugador 1';
        document.getElementById('avatar-0').setAttribute('src', '/images/avatar-0.jpg');
    }

    if (playerB) {
        roomPlayerName[1].innerHTML = playerB.username;
        document.getElementById('avatar-1').setAttribute('src', '/images/' + playerB.avatar + '.jpg');
        roomPlayer[1].classList.remove('d-none');
        playersCount++;
    } else {
        roomPlayerName[1].innerHTML = 'Jugador 2';
        document.getElementById('avatar-1').setAttribute('src', '/images/avatar-0.jpg');

    }

    if (playersCount === 2) {
        roomButtonLeave.classList.add('d-none');
        roomBoard.classList.add('d-none');
        
        var canvasList = document.querySelectorAll('.cell canvas');
        canvasList.forEach((canvas, index) => {
            const context = canvas.getContext('2d');
            context.fillStyle = '#FFF';
            context.fillRect(0, 0, canvas.width, canvas.height);
        });
        
        setTimeout(() => {
            roomPlayerInfo.innerHTML = '¡Preparados!';

            setTimeout(() => {
                roomPlayerInfo.innerHTML = '¡Listos!';

                setTimeout(() => {
                    roomPlayerInfo.innerHTML = '¡Ya!';
                    roomBoard.classList.remove('d-none');
                }, 1000);
            }, 1000);
        }, 1000);
    }
});

socket.on(`game-${userInfo.room.id}`, (info) => {
    const { game, cellId, iPlayer } = info;
    const player = game.players.find((player) => player.gameIndex === iPlayer);

    const canvas = canvasList[cellId - 1];
    let context = canvas.getContext('2d');
    context.fillStyle = player.color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    roomPlayerScore[iPlayer].innerHTML = `${player.score} (${player.score * 4}%)`;

    const playerA = game.players.find((player) => player.gameIndex === 0);
    const playerB = game.players.find((player) => player.gameIndex === 1);

    const totalScore = playerA.score + playerB.score;

    if (totalScore === 25) {
        const index = playerA.score > playerB.score ? playerA.gameIndex : playerB.gameIndex;
        const winner = index === playerA.gameIndex ? playerA.username : playerB.username;
        const colorHex = index === playerA.gameIndex ? playerA.color : playerB.color;
        const color = colorHex === '#007BFF' ? 'blue' : 'red';

        roomPlayerInfo.innerHTML = `¡El juego ha finalizado! Ganador: <span class='score-${color}'>${winner}</span>.`;
        roomButtonLeave.classList.remove('d-none');
    }
});
