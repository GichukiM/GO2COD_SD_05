const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let playerChoices = {};

let rooms = {};

const generateRandomId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const createRoomId = () => {
    let roomId = generateRandomId(7);

    while (rooms[roomId]) {
        roomId = generateRandomId(7);
    }
    return roomId;
};

io.on('connection', (socket) => {

    socket.on('player-choice', (choice, id, roomId) => {
        
        if(!playerChoices[roomId]) {
            playerChoices[roomId] = {};
        }

        playerChoices[roomId][id] = choice;

        const roomPlayers = Object.keys(playerChoices[roomId]);

        if (roomPlayers.length === 2) {
            const player1 = roomPlayers[0];
            const player2 = roomPlayers[1];

            const choice1 = playerChoices[roomId][player1];
            const choice2 = playerChoices[roomId][player2];

            io.to(roomId).emit('update-choices', choice1, choice2, id);
            delete playerChoices[roomId]

        }

    })

    socket.on('create-room', ({ rounds, playerName }) => {

        let roomId = createRoomId();

        const room = {
            roomId: roomId,
            playerName: playerName,
            rounds: rounds,
            users: [],
            currentRound: 1,
            currentPlayer: null,
            board: [],
        }

        rooms[roomId] = room;

        socket.join(roomId);
        io.to(roomId).emit('room-created', roomId, rounds, playerName)
        console.log(`Room ${roomId} created`);
        console.log(rooms);

    });

    socket.on('join-room', (roomId, playerName, id) => {
        socket.join(roomId)
        io.to(roomId).emit('player-joined', roomId, playerName);
    })

    socket.on('player-has-joined', (roomId, playerName, id) => {

        if (!rooms[roomId]) {
            socket.emit("room-not-found")
            return;
        }

        console.log(rooms);
        console.log(`roomId on joining player is ${roomId}`);
        let gameObj = rooms[roomId]
        socket.join(roomId)
        io.to(roomId).emit('start-game', playerName, gameObj.name, gameObj.rounds, id);
        console.log(`Player ${playerName} joined room ${roomId}`);

    })

    socket.on('room-has-created', (roomId, playerName, rounds, id) => {

        if(!rooms[roomId]) {
            socket.emit("room-not-found")
            return;
        }

        socket.join(roomId)
        socket.emit("room-found");
    })

    socket.on('disconnect', () => {
        Object.entries(rooms).forEach(([roomId, room]) => {
            const userIndex = room.users.indexOf(socket.id);
            if (userIndex !== -1) {
                room.users.splice(userIndex, 1);
                delete rooms[roomId]
            }
        });
    });
});


server.listen(process.env.PORT || 8080, () => {
    console.log(`server listening on ${process.env.PORT || 8080}`);
})