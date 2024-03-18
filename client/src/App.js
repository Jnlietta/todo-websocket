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

      return () => {
        socket.disconnect();
      };
  }, []);

  const addTask = (newTaskObj) => {
    //add task to array locally
    setTasks(prevTasks => [...prevTasks, newTaskObj]);
    
    //clear input
    setTaskName('');
  };

  const removeTask = (taskID) => {
    //remove task locally
    setTasks(tasks => tasks.filter(task => task.id !== taskID));

    //emit removal of a task to server
    socket.emit('removeTask', taskID);
  };

  const submitForm = e => {
    e.preventDefault();
    const randomID = uuidv4();
    const newTaskObj = { name: taskName, id: randomID };
    addTask(newTaskObj);

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