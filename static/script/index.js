$(function () {
    $("#modelLogin").modal("show")
    var token = prompt("输入身份access_token", 'access_token' + new Date().getTime())
    var client = prompt("输入客户端client_id", 'client_id')
    var socket = io('http://localhost?access_token=' + token + '&client_id=' + client);
    socket.on('connect', function () {
        socket.on('authFalure', function (message) {
            $('#messages').append($('<li>').css('color', 'red').text('auth ' + message));
        })
        socket.on('disconnect', function (reason) {
            $('#messages').append($('<li>').css('color', 'yellow').text('close because ' + reason));
        })
        socket.on("logout", function (code, reason) {
            $('#messages').append($('<li>').css('color', 'red').text('disconnection success ' + reason));
            socket.disconnect(true)
        })
        $('form').submit(function () {
            var message = $('#m').val()
            socket.emit("publicchat", message)
            $('#messages').append($('<li>').css("text-align", "right").text(message + ":我"));
            sctoButton("messages")
            $('#m').val('')
            return false;
        });
        socket.on("publicchat", function (from, message) {
            $('#messages').append($('<li>').text(from + ":" + message));
        })
        socket.on('leave', function (who) {
            $('#messages').append($('<li>').css('color', 'blue').css("text-align", "center").text(who + ' leave'));
        })
        socket.on('join', function (who) {
            $('#messages').append($('<li>').css('color', 'green').css("text-align", "center").text(who + ' join'));
        })
    })
})

function sctoButton(id) {
    var div = document.getElementById(id);
    div.scrollHeight = div.scrollHeight;
}




