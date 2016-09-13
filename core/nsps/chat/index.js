/**
 * chat连接的核心处理器
 * Created by Tristan on 2016/9/12.
 */
var auth = require('../../auth')

function connectedChat(socket, chat) {
    console.log('connection success socketId is ' + socket.id)

    //设置身份验证的时间期限
    var authTimeOut = setTimeout(function () {
        console.log('auth timeout')
        socket.emit('authFalure', 'timeout')
        socket.ondisconnect(true)
    }, 10000)

    //处理身份验证的事件
    socket.on('auth', function (token, resback) {
        console.log('auth')
        auth(token, socket, function (err,userDetal) {

            if (err) {
                //验证失败，返回失败信息
                resback(false, err.message)
                return
            }

            resback(true, 'auth success')
            //验证成功，清除验证的时间超时期限
            clearTimeout(authTimeOut)

            //这里加入该用户的聊天室
            socket.join('default room')

            //message信息处理
            var onmessage = require('./onmessage')
            socket.on('message', function (msg) {
                onmessage(socket, msg)
            })

            //room 信息处理
            socket.on('send room message',function (roomId,message,resback) {
                resback(true,'rom message send success')
                chat.to(roomId).emit('recive room message',roomId,message)
            })
            
            
            socket.on('one to one message',function (to,message,resback) {
                socket.broadcast.to(to).emit('one to one message',socket.id,message)
            })
        })
    })
    socket.on('disconnect', function () {
        console.log(socket.id + '  close')
        clearTimeout(authTimeOut)

    })

    socket.on('reconnect', function () {
        console.log('reconnect')
    })
}


module.exports = connectedChat