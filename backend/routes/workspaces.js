const express = require('express');
const { createWorkspace, getWorkspaces, joinWorkspace } = require('../workspace');

const router = express.Router();

// Get All Workspaces
router.get('/', (req, res) => {
    const allWorkspaces = getWorkspaces();
    res.json(allWorkspaces);
});

// Create Workspace
router.post('/', (req, res) => {
    const { name } = req.body;
    // For now, let's use a dummy user since we haven't implemented authentication yet
    const creator = 'dummyUser';
    const newWorkspace = createWorkspace(name, creator);
    res.status(201).json(newWorkspace);
});

// Join Workspace
router.post('/join', (req, res) => {
    const { workspaceId } = req.body;
    // For now, let's use a dummy user since we haven't implemented authentication yet
    const user = 'dummyUser';
    const updatedWorkspace = joinWorkspace(workspaceId, user);
    
    if (updatedWorkspace) {
        res.json(updatedWorkspace);
    } else {
        res.status(404).json({ message: 'Workspace not found or already joined' });
    }
});

module.exports = router;