const express = require('express');
const chalk = require('chalk');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const Player = require('./models/Player');
const clientPath = `${__dirname}/../client`;
// load environment variable
require('dotenv').config();
// env PORT
const { PORT } = process.env;
const os = require('os');
const localNetwork = os.networkInterfaces();
const localOSIP = localNetwork.en0.pop().address;
const log = console.log;

// middleware
app.use(express.json());
app.use(express.static(clientPath));

// redirect to home
app.get('/*', (req, res) => {
  res.redirect('/');
});

/*
 * object to store game state
 */
const gameInfo = {
  numConnected: 0,
  players: [],
};

// Server Error Handler
server.on('error', (err) => {
  console.error('Server error:', err);
});

/*
 *  connect
 */
const allClients = [];

io.on('connection', (socket) => {
  allClients.push(socket);

  // console.log(allClients);

  // increment player count
  gameInfo.numConnected += 1;

  // send initial greeting when connected
  socket.emit('hello', 'Welcome, to play please choose a musical note');

  // emit number of players
  io.sockets.emit('updateNumPlayers', gameInfo);

  /*
   * handle name submit, join game
   */
  socket.on('nameSubmit', (nameData) => {
    joinGame(nameData, socket);
  });

  /*
   * like button clicked
   */
  socket.on('likeClicked', (playerID) => {
    const { players } = gameInfo;
    const playerIndex = players.findIndex((player) => player.id === playerID);
    players[playerIndex].darkMode = !players[playerIndex].darkMode;

    // global emitter
    io.sockets.emit('makeNoise', players[playerIndex].name);

    // update state in react for all
    updateGameInfoForAll();
  });

  /*
   * handle user disconnecting
   */
  socket.on('disconnect', (data) => {
    console.log(socket.id);
    console.log('user disconnected');
    // console.dir(data);
    gameInfo.numConnected -= 1;

    let i = allClients.indexOf(socket);
    console.log(i);
    allClients.splice(i, 1);

    updateGameInfoForAll();
  });
});

/*
 * Emit Join Game
 */
function joinGame(playerName, socket) {
  const player = new Player(playerName, socket.id);
  socket.emit('startGame');
  gameInfo.players.push(player);
}

/*
 * Emit Global Game Info
 */
function updateGameInfoForAll() {
  io.sockets.emit('updateGameInfoForAll', gameInfo);
}

/*
 * Start Server
 */
server.listen(PORT, () => {
  log(
    chalk.blue(
      `------------------------------------------------
Game starter, running at http://localhost:${PORT} , 
To connect through a device on the wifi network: http://${localOSIP}:${PORT}
------------------------------------------------`
    )
  );
});
