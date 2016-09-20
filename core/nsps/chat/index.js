/**
 * chat连接的核心处理器
 * Created by Tristan on 2016/9/12.
 */
var auth = require('../../auth')
var init = require('../../init')

var tokenStore = require('../../redis/tokenStore')
var userStore = require('../../redis/userStore')
function connectedChat(socket, chat) {
    console.log('1~   one persion(' + socket.id + ') connection success  (before auth)')

    //设置身份验证的时间期限
    var authTimeOut = setTimeout(function () {
        console.log('auth timeout')
        socket.emit('authFalure', 'timeout')
        socket.ondisconnect(true)
    }, 10000)

    //处理身份验证的事件
    socket.on('auth', function (token,clientId, resback) {
        auth(token,clientId, socket, function (err, userDetal) {
            if (err) {
                //验证失败，返回失败信息
                console.log('   one persion(' + socket.id + ') auth falure because ' + err.message)
                resback(false, err.message)
                socket.disconnect(true)
                return
            }

            init(socket, userDetal, function (err) {
                if (err) {
                    console.log('   one persion(' + socket.id + ') auth falure because ' + err.message)
                    resback(false, err.message)
                    return
                }
                //验证成功，清除验证的时间超时期限返回成功信息
                resback(true, userDetal.userId)

                console.log('2~ one persion(' + socket.id + ') auth success bind user ' + userDetal.userId)

                clearTimeout(authTimeOut)
            })

            socket.on('one to one message', function (to, message, cb) {
                socket.broadcast.to(to).emit("one to one message", socket.id, message)
                cb(null, 'success')
            })


            socket.on('public',function (message) {
                io.to(socket.clientId).emit('public',socket.userId,message)
                chat.to(socket.clientId).emit('public',socket.userId,message)
                socket.broadcast.in(socket.clientId).emit('public',socket.userId,message)
            })
        })
    })

    socket.on('disconnect', function () {
        console.log(socket.id + '  close')
        clearTimeout(authTimeOut)
    })

    socket.on('token', function (tokenStr, resback) {
        var token = JSON.parse(tokenStr)
        tokenStore.savePassport(token, function (err, data) {
            if (err) {
                resback(false, err.message)
                return
            }
            resback(true, data)
        })

    })

    socket.on('user', function (userStr, resback) {
        var user = JSON.parse(userStr)
        userStore.saveUser(user, function (err, data) {
            if (err) {
                resback(false, err.message)
                return
            }
            resback(true, data)
        })
    })


}


function initUserDetalSocket(socket, userDetal) {
    if (userDetal) {
        for (var index in userDetal.rooms) {
            var room = userDetal.rooms[index]
            console.log(userDetal.userId + ' join in the room ' + room)
            socket.join(room)
        }
    }
}

module.exports = connectedChat