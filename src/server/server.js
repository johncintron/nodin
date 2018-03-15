'use strict';

/**
 * Module dependencies.
 * @private
 */
const http = require('http');
const express = require('express');
const config = require('../../config');
const WZManager = require('./wzmanager');
const SocketManager = require('./socketmanager');

/**
 * Module exports.
 * @public
 */
module.exports = {
  run,
};

/**
 * Starts the server.
 * @param {string} rootDir - Outermost directory.
 * @public
 */
function run(rootDir) {
  const app = express().use(express.static(`${rootDir}/client`));
  const httpServer = http.Server(app);
  httpServer.listen(config.PORT, () => {
    console.log(`Listening on port ${config.PORT}`);
  });

  //WZManager.load(config.SERVER_WZ_ROOT_DIR);

  SocketManager.initialize(httpServer);
}
