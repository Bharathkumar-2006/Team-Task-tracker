// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User'); 

// Route to create a task
router.post('/add', async (req, res) => {
  const { userId, name, status } = req.body;

  if (!userId || !name || !status) {
    return res.status(400).json({ error: 'UserId, name, and status are required.' });
  }

  try {
    // Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const newTask = new Task({
      userId, // Assign the task to the user
      name,
      status,
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully!', task: newTask });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Route to update a task by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { userId, name, status } = req.body;

  if (!userId || !status) {
    return res.status(400).json({ error: 'UserId and status are required.' });
  }

  try {
    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { userId, name, status },
      { new: true } // Returns the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully!', task: updatedTask });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Route to fetch all tasks for a specific user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ userId });
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user.' });
    }
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

module.exports = router;
