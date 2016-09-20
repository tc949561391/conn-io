/**
 * Created by j0 on 2016/9/13.
 */
var rf = require("fs");
var path = require('path')
var chat = require('../nsps/chat')
module.exports = function (io) {
    rf.readdir(path.join(__dirname, '../nsps'), function (err, nsps) {
        io.on('connection', function (socket) {
            chat(socket, io)
        })
    })
}