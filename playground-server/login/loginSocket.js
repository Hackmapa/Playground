module.exports = (io, users) => {
  io.on("connection", (socket) => {
    socket.on("login", (user) => {
      users.push({ socketId: socket.id, user: user });
      console.log("User joined", socket.id);
      io.emit("users", users);
    });

    socket.on("disconnect", () => {
      users = users.filter((user) => user.socketId !== socket.id);
      console.log("User left", socket.id);
      io.emit("users", users);
    });
  });
};
