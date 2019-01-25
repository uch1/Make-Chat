//chat.js
module.exports = (io, socket, onlineUsers) => {
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
    })

    
}