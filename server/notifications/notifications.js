module.exports = (io, users) => {
    io.on("connection", (socket) => {
        console.log("User connected");

        socket.on("friendShipAdded", (notification) => {
            console.log("Friendship added notification received");

            console.log(notification)

            // Check if the friend is connected
            const connectedFriend = users.find((user) => user.id === usersFriendship.friendId && user.socketId === socket.id);

            console.log(connectedFriend)
            console.log(socket)

            // if (connectedFriend) {
                console.log("Friend is connected. Emitting notification.");
                io.to(connectedFriend.socketId).emit("friendShipNotification", usersFriendship.userId);
            // } else {
                console.log("Friend is not connected.");
                // You can handle the case where the friend is not connected here
            // }
        });
    });
};
