import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const userId = localStorage.getItem('userId');

  // Redirect to login if no userId is stored
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  // Fetch tasks for the logged-in user
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`https://team-task-tracker.onrender.com/api/tasks/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setTasks(data);
        } else {
          console.error('Error fetching tasks:', data.message);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const handleAddTask = async () => {
    if (newTask.trim() !== '') {
      try {
        const response = await fetch('https://team-task-tracker.onrender.com/api/tasks/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, name: newTask, status: 'To-Do' }),
        });
        const data = await response.json();
        if (response.ok) {
          setTasks((prevTasks) => [...prevTasks, data.task]);
          setNewTask('');
        } else {
          console.error('Error adding task:', data.message);
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`https://team-task-tracker.onrender.com/api/tasks/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, status: newStatus } : task
          )
        );
      } else {
        console.error('Error updating task:', data.message);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const filterTasksByStatus = (status) => tasks.filter((task) => task.status === status);

  return (
    <div className="home-container">
      <h1>Task Manager</h1>

      {/* Add New Task */}
      <div className="task-input-container">
        <input
          type="text"
          placeholder="Add New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="task-input"
        />
        <button onClick={handleAddTask} className="add-btn">
          Add Task
        </button>
      </div>

      {/* Task Panels */}
      <div className="panel-container">
        <div className="panel">
          <h2>To-Do</h2>
          {filterTasksByStatus('To-Do').map((task) => (
            <div key={task._id} className="task-item">
              <span>{task.name}</span>
              <button
                onClick={() => handleChangeStatus(task._id, 'In Progress')}
                className="status-btn"
              >
                Move to In Progress
              </button>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>In Progress</h2>
          {filterTasksByStatus('In Progress').map((task) => (
            <div key={task._id} className="task-item">
              <span>{task.name}</span>
              <button
                onClick={() => handleChangeStatus(task._id, 'To-Do')}
                className="status-btn"
              >
                Move to To-Do
              </button>
              <button
                onClick={() => handleChangeStatus(task._id, 'Completed')}
                className="status-btn"
              >
                Mark as Completed
              </button>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>Completed</h2>
          {filterTasksByStatus('Completed').map((task) => (
            <div key={task._id} className="task-item">
              <span>{task.name}</span>
              <button
                onClick={() => handleChangeStatus(task._id, 'In Progress')}
                className="status-btn"
              >
                Move to In Progress
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem('userId'); // Clear userId from localStorage
          navigate('/login'); // Redirect to login
        }}
        className="logout-btn"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
