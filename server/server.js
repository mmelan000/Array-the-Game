const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const PORT = process.env.PORT || 3001;
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

const ioserver = http.createServer(app);
const io = new Server(ioserver, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('join-room', (data) => {
    console.log(data);
    socket.join(data);
  });

  socket.on('send-message', (data) => {
    console.log(data);
    socket.to(data.lobbyId).emit('receive-message', data);
  });
});

ioserver.listen(3002, () => {
  console.log('Socket.io server is running on port 3002');
});
// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
