const express = require("express");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

let playerChoices = {};

let rooms = {};

const generateRandomId = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

io.on("connection", (socket) => {
  socket.on("player-choice", (choice, id, roomId) => {
    if (!playerChoices[roomId]) {
      playerChoices[roomId] = {};
    }

    playerChoices[roomId][id] = choice;

    const roomPlayers = Object.keys(playerChoices[roomId]);

    if (roomPlayers.length === 2) {
      const player1 = roomPlayers[0];
      const player2 = roomPlayers[1];

      const choice1 = playerChoices[roomId][player1];
      const choice2 = playerChoices[roomId][player2];

      io.to(roomId).emit("update-choices", choice1, choice2, id);
      delete playerChoices[roomId];
    }
  });

  // In your server.js file
  socket.on("create-room", ({ rounds, playerName }) => {
    let roomId = createRoomId();

    const room = {
      roomId: roomId,
      playerName: playerName,
      rounds: rounds,
      users: [],
      currentRound: 1,
      currentPlayer: null,
      board: [],
    };

    rooms[roomId] = room;

    socket.join(roomId);
    io.to(roomId).emit("room-created", roomId, rounds, playerName);
    console.log(`Room ${roomId} created`);

    // Send a response back to the client
    socket.emit("create-room-response", { success: true, roomId: roomId });
  });

  socket.on("join-room", (roomId, playerName, id) => {
    if (!rooms[roomId]) {
      socket.emit("room-not-found"); // Emit room not found if room does not exist
      return;
    }

    socket.join(roomId);
    rooms[roomId].users.push(playerName); // Add player to the room
    console.log(`Player ${playerName} joined room ${roomId}`);

    // Check if both players are in the room before starting the game
    if (rooms[roomId].users.length === 2) {
      const owner = rooms[roomId].playerName; // Owner of the room (first player)
      console.log("Emitting start-game event to players...");
      io.to(roomId).emit(
        "start-game",
        playerName,
        owner,
        rooms[roomId].rounds,
        id
      );
      console.log("Both players are in the room, game will start");
    } else {
      // Emit a message to the room that a player has joined
      io.to(roomId).emit("player-joined", roomId, playerName);
    }

    // Notify the player that they have successfully joined
    socket.emit("joined-room", roomId, playerName);
  });

  socket.on("player-has-joined", (roomId, playerName, id) => {
    if (!rooms[roomId]) {
      socket.emit("room-not-found");
      return;
    }
  
    console.log(`Room details: `, rooms);
    console.log(`Room ID when player joins: ${roomId}`);
  
    let gameObj = rooms[roomId];
    socket.join(roomId);
  
    // Emit start-game event to all players in the room
    io.to(roomId).emit("start-game", {
      playerName, // Name of the joining player
      ownerName: gameObj.playerName, // Name of the room creator (owner)
      rounds: gameObj.rounds, // Total rounds for the game
      id, // Socket ID of the joining player
    });
  
    console.log(`Player ${playerName} joined room ${roomId}`);
  });
  

  socket.on("room-has-created", (roomId, playerName, rounds, id) => {
    if (!rooms[roomId]) {
      socket.emit("room-not-found");
      return;
    }

    socket.join(roomId);
    socket.emit("room-found");
  });

  socket.on("disconnect", () => {
    Object.entries(rooms).forEach(([roomId, room]) => {
      const userIndex = room.users.indexOf(socket.id);
      if (userIndex !== -1) {
        room.users.splice(userIndex, 1);
        delete rooms[roomId];
      }
    });
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`server listening on ${process.env.PORT || 8080}`);
});
