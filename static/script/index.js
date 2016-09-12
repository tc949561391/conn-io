var socket = io('/chat');
$('form').submit(function(){
    socket.emit('message', $('#m').val());
    $('#m').val('');
    return false;
});
socket.on('connect',function () {
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
    socket.on('hi', function(){
        $('#messages').append($('<li>').text('hi'));
    });

    socket.on('message',function (msg) {
        $('#messages').append($('<li>').text(msg));
    })
})
