/**
 * Created by j0 on 2016/9/9.
 */
var express=require('express')
var app = express();
var http = require('http').Server(app);
var path=require('path')
var bodyParser = require('body-parser');
var session=require('express-session')
var io = require('socket.io')(http);
var compass=require('compass')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(compass({ cwd:path.join(__dirname, 'static') }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res){
    res.render('index',{
        title:'home'
    })
});


process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack)
});



io.on('connection',function (socket) {
    console.log('a user connected');
    socket.send('who join the body')
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message',function (msg) {
        io.emit('chat message', msg);
    })

})

module.exports=http