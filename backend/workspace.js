const workspaces = []; // In-memory storage for workspaces

// Create a new workspace
const createWorkspace = (name, creator) => {
    const newWorkspace = { id: Date.now(), name, creator, members: [creator] };
    workspaces.push(newWorkspace);
    return newWorkspace;
};

// Get all workspaces
const getWorkspaces = () => {
    return workspaces;
};

// Add project to workspace
const addProjectToWorkspace = (workspaceId, project) => {
    const workspace = workspaces.find(ws => ws.id === workspaceId);
    if (workspace) {
        workspace.projects.push(project);
        return workspace;
    }
    return null;
};

module.exports = { createWorkspace, getWorkspaces, addProjectToWorkspace };