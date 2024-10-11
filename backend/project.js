const projects = []; // In-memory storage for projects

// Create a new project
const createProject = (name, workspaceId) => {
    const newProject = { id: Date.now(), name, workspaceId: parseInt(workspaceId, 10), tasks: [] };
    projects.push(newProject);
    console.log('All projects after creation:', projects);
    return newProject;
};

// Get all projects for a specific workspace
const getProjectsByWorkspace = (workspaceId) => {
    console.log('Getting projects for workspace:', workspaceId);
    console.log('All projects:', projects);
    return projects.filter(project => project.workspaceId === parseInt(workspaceId, 10));
};

// Add a task to a project
const addTaskToProject = (projectId, task) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.tasks.push(task);
        return project;
    }
    return null;
};

module.exports = { createProject, getProjectsByWorkspace, addTaskToProject };