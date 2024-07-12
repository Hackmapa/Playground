module.exports = (io, users) => {
  io.on("connection", (socket) => {
    socket.on("friendShipAdded", (notification) => {});
  });
};
