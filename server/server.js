const express = require('express');
const { truncate } = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const http = require('http').Server(app);
const PORT = process.env.PORT || 3002;

// console.log(process.env);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const socketIO = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

let users = [];
let games = {};

socketIO.on('connection', (socket) => {
  console.log(`${socket.id} user just connected!`);

  socket.on('joinRoom', ({ user, room }) => {
    if (!user) {
      user = 'Guest' + uuidv4();
    }

    // function addPlayer(room, user) {
    if (games[room]) {
      if (!games[room].playerTwo) {
        games = {
          ...games,
          [room]: {
            ...games[room],
            playerTwo: { player: user, color: 'Blue', isTurn: false },
          },
        };
      } else {
        games = {
          ...games,
          [room]: {
            ...games[room],
            playerThree: { player: user, color: 'Green', isTurn: false },
          },
        };
      }
    } else {
      games = {
        ...games,
        [room]: {
          playerOne: { player: user, color: 'Red', isTurn: false },
        },
      };
    }
    // }
    console.log('line 75');
    console.log(games);
    // }

    socket.join(room);
    console.log(`${user} has joined Room: ${room}`);
    socketIO.to(room).emit('newPlayer', games[room]);
  });

  socket.on('message', ({ user, room, message }) => {
    if (!user) {
      user = 'Guest';
    }
    console.log(`${user} has sent "${message}" to Room: ${room}"`);
    socketIO.to(room).emit('messageResponse', `${user}: ${message}`);
  });

  socket.on('newUser', (username) => {
    if (username === null || undefined) {
      username = `Guest/${uuidv4()}`;
    }
    users.push({ username: username, socket_id: socket.id });
    socketIO.emit('newUserResponse', users);
  });

  socket.on('startGameInit', (players, room) => {
    // console.
    console.log(players);
    if (players[2] === null) {
      players.pop();
    }
    players[Math.floor(Math.random() * players.length)].isTurn = true;

    console.log('l117');
    console.log(players);
    // const turnOrder =[]
    socketIO.to(room).emit('startGame', players);
  });

  socket.on('initEndTurn', (room, board) => {
    socketIO.to(room).emit('endTurn', board);
  });

  socket.on('boardStateSend', (room, board, user) => {});
  //
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    console.log(users);
    users = users.filter((user) => user.socket_id !== socket.id);
    console.log(users);
    socketIO.emit('newUserResponse', users);
    socket.disconnect();
  });
});
http.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
