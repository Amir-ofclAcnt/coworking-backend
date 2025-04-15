let io;

function initSocket(serverIO) {
  io = serverIO;

  io.on('connection', (socket) => {
    console.log('🟢 Ny användare ansluten:', socket.id);

    socket.on('disconnect', () => {
      console.log('🔴 Användare frånkopplad:', socket.id);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io har inte initialiserats!');
  }
  return io;
}

module.exports = { initSocket, getIO };
