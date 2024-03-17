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

    //listener for event addTask
    socket.on('addTask', (task) => {
        //add task to array tasks, task = { name, id }
        tasks.push(task);

        //emiter for other users that there is new task
        socket.broadcast.emit('addTask', task);
    });

    //listener for event removeTask
    socket.on('removeTask', (taskID) => {
        //find task that have to be delete from array tasks and remove it
        const task = tasks.find(task => task.id === taskID);
        const indexOfTask = tasks.indexOf(task);
        users.splice(indexOfTask, 1);

        //emiter for other users that there is deleted task
        socket.broadcast.emit('removeTask', taskID);
    });
  });

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});