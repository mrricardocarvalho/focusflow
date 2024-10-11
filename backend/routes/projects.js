const express = require('express');
const { createProject, getProjectsByWorkspace, addTaskToProject } = require('../project');
const { addProjectToWorkspace } = require('../workspace');

const router = express.Router();

// Create Project
router.post('/', (req, res) => {
    const { name, workspaceId } = req.body;
    console.log('Creating project:', name, 'for workspace:', workspaceId);
    const newProject = createProject(name, parseInt(workspaceId, 10));
    console.log('Created project:', newProject);
    res.status(201).json(newProject);
});

// Get Projects by Workspace ID
router.get('/:workspaceId', (req, res) => {
    const { workspaceId } = req.params;
    console.log('Fetching projects for workspace:', workspaceId);
    const projects = getProjectsByWorkspace(parseInt(workspaceId, 10));
    console.log('Fetched projects:', projects);
    res.json(projects);
});

// Add Task to Project
router.post('/:projectId/tasks', (req, res) => {
    const { projectId } = req.params;
    const task = req.body; // Expecting task details in request body
    const updatedProject = addTaskToProject(Number(projectId), task);
    
    if (updatedProject) {
        res.json(updatedProject);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

module.exports = router;