const projects = []; // In-memory storage for projects

// Create a new project
const createProject = (name, workspaceId) => {
    const newProject = { 
        id: Date.now(), 
        name, 
        workspaceId: parseInt(workspaceId, 10), 
        tasks: [] 
    };
    projects.push(newProject);
    return newProject;
};

// Get all projects for a specific workspace
const getProjectsByWorkspace = (workspaceId) => {
    return projects.filter(project => project.workspaceId === parseInt(workspaceId, 10));
};

// Add a task to a project
const addTaskToProject = (projectId, taskName, dueDate, priorityLevel) => {
    const project = projects.find(p => p.id === parseInt(projectId, 10));
    if (project) {
        const newTask = { 
            id: Date.now(), 
            name: taskName, 
            completed: false, 
            dueDate, 
            priorityLevel,
            status: 'todo'
        };
        project.tasks.push(newTask);
        return newTask;
    }
    return null;
};

// Get all tasks for a specific project
const getTasksByProject = (projectId) => {
    const project = projects.find(p => p.id === parseInt(projectId, 10));
    return project ? project.tasks : [];
};

// Get tasks from multiple projects
const getTasksFromMultipleProjects = (projectIds) => {
    const tasks = [];
    projects.forEach(project => {
        if (projectIds.includes(project.id.toString())) {
            tasks.push(...project.tasks.map(task => ({...task, projectName: project.name})));
        }
    });
    return tasks;
};

// Toggle task completion
const toggleTaskCompletion = (projectId, taskId) => {
    const project = projects.find(p => p.id === parseInt(projectId, 10));
    if (project) {
        const task = project.tasks.find(t => t.id === parseInt(taskId, 10));
        if (task) {
            task.completed = !task.completed;
            return task;
        }
    }
    return null;
};

// Edit Task
const editTask = (projectId, taskId, updatedTask) => {
    const project = projects.find(p => p.id === parseInt(projectId, 10));
    if (project) {
        const taskIndex = project.tasks.findIndex(t => t.id === parseInt(taskId, 10));
        if (taskIndex !== -1) {
            project.tasks[taskIndex] = { ...project.tasks[taskIndex], ...updatedTask };
            return project.tasks[taskIndex];
        }
    }
    return null;
};

// Delete Task
const deleteTask = (projectId, taskId) => {
    console.log(`Deleting task ${taskId} from project ${projectId}`);
    const project = projects.find(p => p.id === parseInt(projectId, 10));
    if (project) {
        console.log('Project found');
        const taskIndex = project.tasks.findIndex(t => t.id === parseInt(taskId, 10));
        if (taskIndex !== -1) {
            console.log(`Task found at index ${taskIndex}`);
            project.tasks.splice(taskIndex, 1);
            return true;
        } else {
            console.log('Task not found in project');
        }
    } else {
        console.log('Project not found');
    }
    return false;
};

module.exports = { 
    createProject, 
    getProjectsByWorkspace, 
    addTaskToProject, 
    getTasksByProject, 
    toggleTaskCompletion,
    editTask,
    deleteTask,
    getTasksFromMultipleProjects
};
