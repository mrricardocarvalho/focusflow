const express = require('express');
const { 
    createProject, 
    getProjectsByWorkspace, 
    addTaskToProject, 
    getTasksByProject, 
    toggleTaskCompletion,
    editTask,
    deleteTask
} = require('../project');

const router = express.Router();

// Create Project
router.post('/', (req, res) => {
    const { name, workspaceId } = req.body;
    const newProject = createProject(name, workspaceId);
    res.status(201).json(newProject);
});

// Get Projects by Workspace ID
router.get('/workspace/:workspaceId', (req, res) => {
    const { workspaceId } = req.params;
    const projects = getProjectsByWorkspace(workspaceId);
    res.json(projects);
});

// Add Task to Project
router.post('/:projectId/tasks', (req, res) => {
    const { projectId } = req.params;
    const { name, dueDate, priorityLevel } = req.body;
    const newTask = addTaskToProject(projectId, name, dueDate, priorityLevel);
    
    if (newTask) {
        res.status(201).json(newTask);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

// Get Tasks by Project ID
router.get('/:projectId/tasks', (req, res) => {
    const { projectId } = req.params;
    const tasks = getTasksByProject(projectId);
    res.json(tasks);
});

// Toggle Task Completion
router.patch('/:projectId/tasks/:taskId/toggle', (req, res) => {
    const { projectId, taskId } = req.params;
    const updatedTask = toggleTaskCompletion(projectId, taskId);
    
    if (updatedTask) {
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Project or Task not found' });
    }
});

// Edit Task
router.put('/:projectId/tasks/:taskId', (req, res) => {
    const { projectId, taskId } = req.params;
    const updatedTask = req.body;
    const result = editTask(projectId, taskId, updatedTask);
    
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ message: 'Project or Task not found' });
    }
});

// Delete Task
router.delete('/:projectId/tasks/:taskId', (req, res) => {
    const { projectId, taskId } = req.params;
    console.log(`Attempting to delete task ${taskId} from project ${projectId}`);
    try {
        const result = deleteTask(projectId, taskId);
        
        if (result) {
            console.log('Task deleted successfully');
            res.json({ message: 'Task deleted successfully' });
        } else {
            console.log('Project or Task not found');
            res.status(404).json({ message: 'Project or Task not found' });
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;