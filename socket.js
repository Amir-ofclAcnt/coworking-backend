io.use(authenticateSocket);
io.on('connection', socket => {
  console.log('User connected:', socket.user.username);
  socket.on('disconnect', () => console.log('User disconnected'));
});

app.set('io', io);