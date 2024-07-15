import post from "../utils/post.js";

export default (io, users) => {
  io.on("connection", (socket) => {
    socket.on("sendFriendRequest", async (userId, friendId, users, token) => {
      const response = await post(
        `friends/${userId}/add/${friendId}`,
        {},
        token
      );

      if (response.error) {
        socket.emit("error", response.error);
      } else {
        const notification = response;
        const friend = users.find((user) => user.user.id === friendId);

        if (friend) {
          io.to(friend.socketId).emit("friendRequest", notification);
        }
      }
    });

    socket.on("acceptFriendRequest", async (userId, friendId, users, token) => {
      const response = await post(
        `friends/${userId}/accept/${friendId}`,
        {},
        token
      );

      if (response.error) {
        socket.emit("error", response.error);
      } else {
        const notification = response;
        const friend = users.find((user) => user.user.id === friendId);

        if (friend) {
          io.to(friend.socketId).emit("friendRequestAccepted", notification);
        }
      }
    });

    socket.on("rejectFriendRequest", async (userId, friendId, users, token) => {
      const response = await post(
        `friends/${userId}/decline/${friendId}`,
        {},
        token
      );

      if (response.error) {
        socket.emit("error", response.error);
      } else {
        const notification = response;
        const friend = users.find((user) => user.user.id === friendId);

        if (friend) {
          io.to(friend.socketId).emit("friendRequestDeclined", notification);
        }
      }
    });
  });
};
