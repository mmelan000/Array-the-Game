const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const { v4: uuidv4 } = require('uuid');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const PORT = process.env.PORT || 3001;
const ioPORT = process.env.ioPORT || 3002;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

let users = [];

socketIO.on('connection', (socket) => {
  console.log(`${socket.id} user just connected!`);

  socket.on('joinRoom', (data) => {
    socket.join(data.room);
    console.log(`${data.user} has joined Room: ${data.room}`);
  });

  socket.on('message', ({ user, room, message }) => {
    if (!user) {
      user = 'Guest';
    }
    console.log(`${user} has sent "${message}" to Room: ${room}"`);
    socketIO.to(room).emit('messageResponse', `${user}: ${message}`);
  });

  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

  socket.on('newUser', (data) => {
    if (data === null) {
      data = `Guest/${uuidv4()}`;
    }
    console.log(`${data} has connected.`);
    users.push(data);
    socketIO.emit('newUserResponse', users);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    console.log(users);
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit('newUserResponse', users);
    socket.disconnect();
  });
});
http.listen(ioPORT, () => {
  console.log(`Socket.io server is running on port ${ioPORT}`);
});
// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
