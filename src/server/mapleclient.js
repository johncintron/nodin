'use strict';

class MapleClient {
  constructor(socket) {
    this.socket = socket;

    this.id = null;
    this.username = null;
    this.loggedIn = false;
  }
}

/**
 * Module exports.
 * @public
 */
module.exports = {
  MapleClient,
};
