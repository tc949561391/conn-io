/**
 * Created by j0 on 2016/9/12.
 */
function connected(io) {
    var chat = io.of('/chat')
    chat.on('connection', function (socket) {
        socket.join('room1')
        console.log(socket.id + ': connected');
        socket.broadcast.send(socket.id + ':join')

        socket.on('message', function (msg) {
            chat.to('room2').emit('message', msg+'1');
        })
        socket.on('disconnect', function () {
            socket.broadcast.send(socket.id + ':leave')
            console.log(socket.id + ': disconnected');
        });
        socket.on('chat message', function (msg) {
            chat.to('room1').emit('chat message', msg);
        })
    })
}
module.exports = connected