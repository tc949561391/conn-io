/**
 * Created by j0 on 2016/9/14.
 */
var conn=require('./conn')
var util=require('util')

var key='%s:tokens:%s'

function getToken(token,clientId,callback) {
    conn.select('11',function () {
        conn.hgetall(util.format(key,clientId,token),function (err,passport) {
            if (err){
                callback(err)
                return
            }
            callback(null,passport)
        })
    })
}


function saveToken(passport,callback) {
    conn.select('11',function () {
       conn.hmset(util.format(key,passport.clientId,passport.access_token),passport,function (err,data) {
           if (err){
               callback(err)
               return
           }
           callback(null,data)
       })
    })
}
module.exports.getPassport=getToken
module.exports.savePassport=saveToken