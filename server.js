const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    path    = require("path"),
    io = require('socket.io').listen(server),
    usernames = [];
    




app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname+'/index.html'));
});

io.sockets.on('connection', (socket) =>{
    console.log('Socket Connected');

    socket.on('new user', (data, callback)=>{
        if(usernames.indexOf(data) != -1){
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }
    });

    //Update Usernames
    function updateUsernames(){
        io.sockets.emit('usernames', usernames);
    }

    //Send Message
    socket.on('send message',(data) =>{
        io.sockets.emit('new message', {msg: data,user:socket.username});
    });

    //Disconnect Event
    socket.on('disconnect', (data)=>{
        if(!socket.username){
            return; 
        }
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
    });
});

server.listen(process.env.PORT || 3000, function () {
console.log('Our Site is on Port 3000');
});