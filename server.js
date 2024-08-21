const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log('Usuário conectado:', socket.id);

    socket.on('join-room', roomID => {
        socket.join(roomID);
        socket.to(roomID).emit('new-user', socket.id);

        socket.on('signal', data => {
            io.to(data.to).emit('signal', data);
        });

        socket.on('disconnect', () => {
            socket.to(roomID).emit('user-disconnected', socket.id);
            console.log('Usuário desconectado:', socket.id);
        });

        socket.on('chat-message', message => {
            socket.to(roomID).emit('chat-message', message);
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
