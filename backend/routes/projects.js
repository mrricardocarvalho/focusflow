const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Create a new project
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.user._id
    });
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all projects for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id });
    res.send(projects);
  } catch (error) {
    res.status(500).send();
  }
});

// Get a specific project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) {
      return res.status(404).send();
    }
    res.send(project);
  } catch (error) {
    res.status(500).send();
  }
});

// Update a project
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'description'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });

    if (!project) {
      return res.status(404).send();
    }

    updates.forEach((update) => project[update] = req.body[update]);
    await project.save();
    res.send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!project) {
      res.status(404).send();
    }

    res.send(project);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
