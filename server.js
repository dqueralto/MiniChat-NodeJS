/*const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  //res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Type', 'text/html');

  res.end('<h1>Hola mundo</h1>');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/
var express = require('express');

var app = express();
app.use('/public', express.static(__dirname + '/public'))

var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('Hello world');
});

app.get('/html', function(req, res){
    res.sendFile(__dirname + '/src/index.html');
});

app.get('/blas', function(req, res){
    res.send('<h1>¡¡¡MUERETE!!!</h1>');
});


io.on('connection', function(socket){
    socket.on('usuario', function(usuario){
        console.log('a user connected');
        if (usuario.replace(" ", "") != '' && usuario != null && usuario != undefined){
            io.emit('conectado', usuario);

            socket.on('chat', function(msg){
                console.log('message: ' + msg);
                var datos = {
                    autor: usuario, 
                    mensajes: msg
                };
                io.emit('chat', datos);
            });

            socket.on('disconnect', function(){
                console.log('user disconnected');
                io.emit('desconectado', usuario);

            });

            socket.on('escribiendo', function(){
                console.log('Escribiendo ....');
                socket.broadcast.emit('visualizar escribiendo', usuario);
                //$('#lab').append($('<label>').text(usuario+' está escribiendo...'));


            });

            socket.on('no escribiendo', function(){
                io.emit('ocultar escribiendo');

            });

            socket.on('subirfichero',function(){
                var uploader = new siofu();
                uploader.dir = "/path/to/save/uploads";
                uploader.listen(socket);
            });




        }
    });


});





http.listen(3020, function(){
  console.log('listening on *:3020');
});


