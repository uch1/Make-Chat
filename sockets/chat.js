//chat.js
module.exports = (io, socket) => {
    //Future socket listeners will be here

    socket.on('new user', (username) => {
        console.log(`${username} has joined the chat!`);
        // Send the username to all clients currently connected 
        io.emit('new user', username);
    })
}