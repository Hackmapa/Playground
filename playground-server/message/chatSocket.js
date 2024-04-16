// messageSocket.js
module.exports = (io, messages) => {
  io.on("connection", (socket) => {
    socket.on("sendMessage", (message) => {
      message.date = new Date();
      messages.push(message);
      io.emit("updateMessages", message);
    });
  });
};
