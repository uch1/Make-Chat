//chat.js
module.exports = (io, socket, onlineUsers, channels) => {
    //Future socket listeners will be here

    socket.on('new user', (username) => {
        
        // Save the username as key to access the user's socket id
        onlineUsers[username] = socket.id;
        // Save the username to socket as well. This is important for later. 
        socket["username"] = username;
        console.log(`${username} has joined the chat!`);
        // Send the username to all clients currently connected 
        io.emit('new user', username);
    })

    // Listen for new messages 
    socket.on('new message', (data) => {
        // Send the data back to all clients 
        console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
        io.emit('new message', data);
    })

    // List for online users 
    socket.on('get online users', () => {
        // Send over the online users
        socket.emit("get online users", onlineUsers);
    })

    // This fires when a user closes out of the application 
    socket.on('disconnect', () => {
        // This delets the user by using the username we saved to the socket
        delete onlineUsers[socket.username]
        io.emit('user has left', onlineUsers)
    })

    // Create a new channel 
    socket.on('new channel', (newChannel) => {
        console.log(newChannel);

        // Save the new channel to our channels object. They array will hold the message. 
        channels[newChannel] = [];
        // Have the socket join the new channel room. 
        socket.join(newChannel);
        // Inform all clients of the new channel. 
        io.emit('new channel', newChannel);
        // Emit to the client that made the new channel, to change their channel to the one they made.
        socket.emit('user changed channel', {
            channel: newChannel,
            messages: channels[newChannel]
        });

    })

    socket.on('new messages', (data) => {
        // Save the new message to the channel. 
        channels[data.channel].push({ sender: data.sender, message: data.message });
        // Emit only to sockets that are in that channel room.
        io.to(data.channel).emit('new message', data);
    })


}