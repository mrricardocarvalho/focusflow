const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const tasks = await db.collection('tasks').find().toArray();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single task
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(req.params.id) });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const newTask = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status || 'todo',
      assignee: req.body.assignee,
      dueDate: req.body.dueDate,
      projectId: req.body.projectId,
      createdBy: req.body.createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('tasks').insertOne(newTask);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const updatedTask = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      assignee: req.body.assignee,
      dueDate: req.body.dueDate,
      projectId: req.body.projectId,
      updatedAt: new Date()
    };
    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedTask }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
