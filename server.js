const express = require('express');
const socket = require('socket.io');

const app = express();
const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
    //emiter to socket that is serving now (new user)
    socket.emit('updateData', tasks);

    //listener for event addTask
    socket.on('addTask', (newTaskObj) => {
        //add task to array tasks, newTaskObj = { name, id }
        tasks.push(newTaskObj);

        //emiter for other users that there is new task
        socket.broadcast.emit('addTask', newTaskObj);
    });

    //listener for event removeTask
    socket.on('removeTask', (taskID) => {
        //find task that have to be delete from array tasks and remove it
        const task = tasks.find(task => task.id === taskID);
        const indexOfTask = tasks.indexOf(task);
        tasks.splice(indexOfTask, 1);

        const removeTaskData = { taskID: taskID, socketID: socket.id }

        //emiter for other users that there is deleted task
        socket.broadcast.emit('removeTask', removeTaskData);
    });
  });

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});