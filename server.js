const express = require('express');
const socket = require('socket.io');

const app = express();
const tasks =[];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
    //emiter to socket that is serving now (new user)
    socket.emit('ubdateData', tasks)
  });

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});