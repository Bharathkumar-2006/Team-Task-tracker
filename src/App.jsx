import { useState } from 'react';
import './App.css';

function App() {
  
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState('');

  // Add a new task
  const addTask = () => {
    const newTask = {
      name: taskName,
      status: taskStatus,
    };
    setTasks([...tasks, newTask]);
    setTaskName('');
    setTaskStatus('');
  };

  // Render the tasks
  const taskList = tasks.map((task, index) => (
    <div key={index}>
      <p><strong>Task:</strong> {task.name}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <hr />
    </div>
  ));

  return (
    <div className="App">
      <h1>Team Task Tracker</h1>
      <div>
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Status"
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div>{taskList}</div>
    </div>
  );
}

export default App;
