/**
 * Created by j0 on 2016/9/13.
 */
var rf = require("fs");
var path = require('path')
module.exports = function (io) {
    rf.readdir(path.join(__dirname, '../nsps'), function (err, nsps) {
        for (var i in nsps) {
            var nsp = io.of(nsps[i])
            nsp.on('connection', function (socket) {
                require('../nsps/' + nsps[i])(socket, nsp,io)
            })
        }
    })
}