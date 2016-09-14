var socket = io('/chat', {
    name: 'json'
});

var cmds = new Array()

socket.on('connect', function () {
    socket.on('authFalure', function (message) {
        $('#messages').append($('<li>').css('color', 'red').text('auth ' + message));
    })

    socket.on('disconnect', function (reason) {
        $('#messages').append($('<li>').css('color', 'yellow').text('close because ' + reason));
    })
    registerListern(socket)

    $('form').submit(function () {
        var options = $('#m').val().split('$')
        var commond = options[0]
        var body = options[1]
        if (body) {
            if (options[2]) {
                socket.emit(commond, body, options[2], function (res, message) {
                    $('#messages').append($('<li>').text(commond + '  ' + message));
                })
            } else {
                socket.emit(commond, body, function (res, message) {
                    $('#messages').append($('<li>').text(commond + '  ' + message));
                })
            }
            if (fg) {
                cmds[cmds.length] = $('#m').val()
            }
            $('#m').val('')
        }
        return false;
    });

})


function registerListern(socket) {
    socket.on('message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    })

    socket.on('recive room message', function (roomId, message) {
        $('#messages').append($('<li>').text("room message:" + roomId + ":" + message));
    })

    socket.on('one to one message', function (from, message) {
        $('#messages').append($('<li>').text(from + ":" + message));
    })

    socket.on('public', function (from, message) {
        $('#messages').append($('<li>').text('publc:'+from + ":" + message));
    })
}
var fg = true
$('input').keydown(function (event) {
    var i = cmds.length
    if (event.keyCode == 37 || event.keyCode == 38) {
        fg = false
        switch (event.keyCode) {
            case 37:
                if (i > 0) {
                    i--
                }
                break;
            case 39:
                if (i < cmds.length - 2) {
                    i++
                }
                break;
        }
        $('#m').val(cmds[i].toString())
    } else {
        fg = true
    }
})
