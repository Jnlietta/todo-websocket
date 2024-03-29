const express = require('express');
const socket = require('socket.io');
const path = require('path');

const app = express();
const tasks = [];

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
    //emiter to socket that is serving now (new user)
    socket.emit('updateData', tasks);
    console.log('New client! Its id – ' + socket.id);

    //listener for event addTask
    socket.on('addTask', (newTaskObj) => {
        //add task to array tasks, newTaskObj = { name, id }
        tasks.push(newTaskObj);
        console.log('5 New task is added: ' + newTaskObj);
        console.log('6 Array tasks in server updated: ',tasks);

        //emiter for other users that there is new task
        socket.broadcast.emit('addTask', newTaskObj);
        console.log('7 Socket ' + socket.id + ' emited the event addTask to other sockets.')
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