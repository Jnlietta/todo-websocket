import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
      const socket = io('ws://localhost:8000', { transports: ['websocket'] });
      setSocket(socket);
      
      socket.on('addTask', ( newTaskObj ) => addTask(newTaskObj));
      socket.on('removeTask', ({ taskID, socketID }) => removeTask(taskID, socketID));
      socket.on('updateData', ( tasks ) => updateTasks(tasks));

      return () => {
        socket.disconnect();
      };
  }, []);

  const updateTasks = (data) =>{
    console.log('updateTasks data: ', data);
    // array tasks from server data is not empty
    if (data) {
      setTasks(data);
    }
  };

  const addTask = (newTaskObj) => {
    console.log('2 addTask newTaskObj: ', newTaskObj);
    //add task to array locally
    setTasks(prevTasks => [...prevTasks, newTaskObj]);
    console.log('3 addTask array tasks: ', tasks);
    
    //clear input
    setTaskName('');
  };

  const removeTask = (taskID, socketID) => {
    //remove task locally
    setTasks(tasks => tasks.filter(task => task.id !== taskID));

    // if calling of func removeTask not comes from server
    if(!socketID){
      //emit removal of a task to server
      socket.emit('removeTask', taskID);
    }
  };

  const submitForm = e => {
    e.preventDefault();
    const randomID = uuidv4();
    const newTaskObj = { name: taskName, id: randomID };
    console.log("1 submitForm newTaskObj: ", newTaskObj);
    addTask(newTaskObj);
    console.log("4 submitForm newTaskObj: ", newTaskObj);

    //emit event addTask with new task to server
    socket.emit('addTask', newTaskObj);
  };

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className="task">
              {task.name}
              <button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button>
            </li>
          ))}
        </ul>
  
        <form id="add-task-form" onSubmit={submitForm}>
          <input 
            className="text-input" 
            value={taskName} 
            autoComplete="off" 
            type="text" 
            placeholder="Type your description" 
            id="task-name" 
            onChange={e => setTaskName(e.target.value)}
          />
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
  );
}

export default App;