/**
 * Created by j0 on 2016/9/14.
 */
var conn = require('./conn')
var util=require('util')
var key='detail:user:%s'
function getUserConnectMessage(userId, callback) {
    conn.select('1', function () {
        conn.hgetall(util.format(key,userId), function (err, userDetal) {
            if (err) {
                callback(err)
                return
            }
            callback(null, userDetal)
        })
    })
}
module.exports.getUserConnectMessage = getUserConnectMessage


function saveUser(user, callback) {
    conn.select('1', function () {
        conn.hmset(util.format(key,user.userId),user,callback)
    })
}

module.exports.saveUser = saveUser