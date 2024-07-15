export default (io, users) => {
  io.on("connection", (socket) => {
    socket.on("friendShipAdded", (notification) => {});
  });
};
