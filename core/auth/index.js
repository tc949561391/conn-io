/**
 * 身份验证处理，当验证失败的时候，callback（err）
 * Created by j0 on 2016/9/13.
 */
var tokenStore = require('../redis/tokenStore')
var userStore = require('../redis/userStore')
module.exports = function (token, clientId, socket, callback) {
    tokenStore.getPassport(token, clientId, function (err, passport) {
        if (err) {
            callback(err)
            return
        }

        if (passport === null) {
            callback(new Error('无对应的access_token'))
            return
        }

        userStore.getUserConnectMessage(passport.userId, function (err, userDetal) {
            if (err) {
                callback(err)
                return
            }
            if (userDetal === null) {
                callback(new Error('无法获取对应的用户信息'))
                return
            }
            console.log('userId:' + passport.userId + '  get userDetal success' + userDetal)
            socket.join(passport.clientId)
            socket.clientId = passport.clientId
            socket.userId = passport.userId
            callback(null, userDetal)
        })
    })
}