'use strict';

/**
 * Module dependencies.
 * @private
 */
const socketIo = require('socket.io');
const MapleClient = require('./mapleclient').MapleClient;

/**
 * Module exports.
 * @public
 */
module.exports = {
  initialize,
};

// Maps socket id to MapleClient instance.
const clients = new Map();

const handlers = {
  disconnect: handleDisconnect,
  login: handleLogin,
};

/**
 * Initializes WebSocket.
 * @param {object} httpServer - HTTP server instance.
 * @public
 */
function initialize(httpServer) {
  const io = socketIo(httpServer);
  io.on('connection', socket => {
    handleNewConnection(socket);

    Object.entries(handlers).forEach(([eventKey, handlerFunction]) => {
      socket.on(eventKey, handlerFunction.bind(null, clients.get(socket.id)));
    });
  });
}

/**
 * Handles new WebSocket connection.
 * @param {object} socket - WebSocket connection.
 * @private
 */
function handleNewConnection(socket) {
  clients.set(socket.id, new MapleClient(socket));
  const remoteAddress = socket.handshake.address;
  console.log(`${socket.id} connected`);
}

/**
 * Handles disconnection.
 * @param {object} client - MapleClient instance.
 * @private
 */
function handleDisconnect(client) {
  console.log(`${client.socket.id} disconnected`);
  clients.delete(client.socket.id);
}

/**
 * Handles login.
 * @param {object} client - MapleClient instance.
 * @param {object} data - Sent data.
 * @private
 */
function handleLogin(client, data) {
  console.log(client.socket.id, data);
}
