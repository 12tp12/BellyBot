/**
 * Created by Tomer Patel on 7/6/2017.
 */

var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World!');
}).listen(3000);

var net = require('net');

var server = net.createServer(function (socket) {
    socket.write("hi Thats tomer\r\n");
    socket.on('data',function(dat){
        socket.write(dat+"\r\n");
    });
});

server.listen(23, "127.0.0.1");


