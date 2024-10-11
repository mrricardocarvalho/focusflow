import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Projects from './Projects';

function Workspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [expandedWorkspaceId, setExpandedWorkspaceId] = useState(null);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/workspaces');
      setWorkspaces(response.data);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/workspaces', { name: workspaceName });
      setWorkspaces([...workspaces, response.data]);
      setWorkspaceName('');
      alert('Workspace created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating workspace');
    }
  };

  const toggleProjects = (workspaceId) => {
    setExpandedWorkspaceId(expandedWorkspaceId === workspaceId ? null : workspaceId);
  };

  return (
    <div>
      <h2>My Workspaces</h2>
      <form onSubmit={handleCreateWorkspace}>
        <input 
          type="text" 
          placeholder="New Workspace Name" 
          value={workspaceName} 
          onChange={(e) => setWorkspaceName(e.target.value)} 
          required 
        />
        <button type="submit">Create Workspace</button>
      </form>

      <ul>
        {workspaces.map(ws => (
          <li key={ws.id}>
            {ws.name} - Members: {ws.members.join(', ')}
            <button onClick={() => toggleProjects(ws.id)}>
              {expandedWorkspaceId === ws.id ? 'Hide Projects' : 'Show Projects'}
            </button>
            {expandedWorkspaceId === ws.id && <Projects workspaceId={ws.id} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Workspaces;