const MySocket = {};

MySocket.initialize = async function() {
  this.socket = await this.loadSocket();
};

MySocket.loadSocket = function() {
  return new Promise(resolve => {
    const socketScript = document.createElement('script');
    socketScript.src = '/socket.io/socket.io.js';
    socketScript.onload = () => {
      const socket = io();
      io = undefined;
      socketScript.remove();
      resolve(socket);
    };
    document.head.appendChild(socketScript);
  });
};

MySocket.emit = function(key, data) {
  this.socket.emit(key, data);
};

export default MySocket;
