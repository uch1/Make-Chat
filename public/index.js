$(document).ready( () => {
    //index.js
    const socket = io.connect();
    let currentUser;
    socket.emit('get online users');
    //Each user should be in the general channel by default.
    socket.emit('user changed channel', "General");

    //Users can change the channel by clicking on its name.
    $(document).on('click', '.channel', (e)=>{
    let newChannel = e.target.textContent;
    socket.emit('user changed channel', newChannel);
    });

    $("#createUserBtn").click((e) => {
        e.preventDefault();
        if ($("#usernameInput").val().length > 0) {
            socket.emit("new user", $("#usernameInput").val());
            // Save the current user when created
            currentUser = $("#usernameInput").val();
            $(".usernameForm").remove();
            $(".mainContainer").css("display", "flex");
        }
        // let username = $("#usernameInput").val();
        // if (username.length > 0) {
        //     // Emit to the server the new user 
        //     socket.emit('new user', username);
        //     $(".usernameForm").remove();
        //     // Have the main page visible 
        //     $('.mainContainer').css('display', 'flex');
        // }
    });

    $("#sendChatBtn").click((e) => {
        e.preventDefault();
        // Get the message text value 
        // let message = $('#chatInput').val();
        // // Make sure it's not empty
        // if (message.length > 0) {
        //     // Emit the message with the current user to the server 
        //     socket.emit('new message', {
        //         sender: currentUser,
        //         message: message
        //     });
        //     $("#chatInput").val("");
        // }

        //   // Get the client's channel
        let channel = $('.channel-current').text();
        let message = $('#chatInput').val();
        if(message.length > 0){
            socket.emit('new message', {
            sender : currentUser,
            message : message,
            //Send the channel over to the server
            channel : channel
            });
            $('#chatInput').val("");
        }
    });

     // Create a new channel 
     $("#newChannelBtn").click(() => {
        let newChannel = $("#newChannelInput").val();

        if (newChannel.length > 0) {
            // Emit the new channel to the server 
            socket.emit('new channel', newChannel);
            $("#newChannelInput").val("");
        }
    })

    // Socket Listeners 
    socket.on('new user', (username) => {
        console.log(`✋ ${username} has joined the chat! ✋`);
        // Add the new user to the online users div 
        $('.usersOnline').append(`${username}`);
    })

    // Output the new message 
    socket.on('new message', (data) => {
        $(".messageContainer").append(
            <div class="message">
                <p class="messageUser">${data.sender}: </p>
                <p class="messageText">${data.message}</p>
            </div>
        )
    });

    // Output online users 
    socket.on('get online users', (onlineUsers) => {
        // You may have not have seen this for loop before. It's syntax is for(key in obj)
        // Our usernames are keys in the object of onlineUsers. 
        for(username in onlineUsers) {
            $(".usersOnline").append(`<p class="userOnline">${username}</p>`);
        }
    })

    //Refresh the online user list
    socket.on('user has left', (onlineUsers) => {
        $('.usersOnline').empty();
        for(username in onlineUsers){
        $('.usersOnline').append(`<p>${username}</p>`);
        }
    });

   // Add the new channel to the channels list (Fires for all clients)
   socket.on('new channel', (newChannel) => {
       $('.channels').append(`<div class="channel">${newChannel}</div>`);
   });

   // Make the channel joined the current channel. Then load the messages.
   // This only fires for the client who made the channel. 
   socket.on('user changed channel', (data) => {
        $('.channel-current').addClass('channel');
        $('.channel-current').removeClass('channel-current');
        $(`.channel:contains('${data.channel}')`).addClass('channel-current');
        $('.channel-current').removeClass('channel');
        $('.message').remove();
        data.messages.forEach((message) => {
        $('.messageContainer').append(`
            <div class="message">
            <p class="messageUser">${message.sender}: </p>
            <p class="messageText">${message.message}</p>
            </div>
        `);
        });   
   })

   socket.on('new message', (data) => {
    //Only append the message if the user is currently in that channel
    let currentChannel = $('.channel-current').text();
    if(currentChannel == data.channel){
      $('.messageContainer').append(`
        <div class="message">
          <p class="messageUser">${data.sender}: </p>
          <p class="messageText">${data.message}</p>
        </div>
      `);
    }
  })

  })