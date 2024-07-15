// messageSocket.js
export default (io, messages) => {
  io.on("connection", (socket) => {
    socket.on("sendMessage", (message) => {
      message.date = new Date();
      messages.push(message);
      io.emit("updateMessages", message);
    });
  });
};
