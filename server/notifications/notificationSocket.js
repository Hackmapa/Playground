import post from "../utils/post.js";
import deleteMethod from "../utils/delete.js";

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

    socket.on("removeFriend", async (userId, friendId, users, token) => {
      const response = await deleteMethod(
        `friends/${userId}/remove/${friendId}`,
        {},
        token
      );

      if (response.error) {
        socket.emit("error", response.error);
      } else {
        const friend = users.find((user) => user.user.id === friendId);
        const user = users.find((user) => user.user.id === userId);

        if (friend) {
          io.to(friend.socketId).emit("friendShipRemoved");
        }

        if (user) {
          io.to(user.socketId).emit("friendShipRemoved");
        }
      }
    });
  });
};
