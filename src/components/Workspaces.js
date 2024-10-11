import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Projects from './Projects';

function Workspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

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
      await axios.post('http://localhost:5000/api/workspaces', { name: workspaceName });
      setWorkspaceName('');
      fetchWorkspaces();
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const toggleWorkspace = (workspaceId) => {
    setSelectedWorkspaceId(selectedWorkspaceId === workspaceId ? null : workspaceId);
  };

  return (
    <div>
      <div className="header">
        <h2>Workspaces</h2>
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
      </div>
      <div className="workspace-list">
        {workspaces.map(ws => (
          <div key={ws.id} className="workspace-item">
            <h3>{ws.name}</h3>
            <p>Members: {ws.members.join(', ')}</p>
            <button onClick={() => toggleWorkspace(ws.id)}>
              {selectedWorkspaceId === ws.id ? 'Hide Projects' : 'Show Projects'}
            </button>
            {selectedWorkspaceId === ws.id && <Projects workspaceId={ws.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workspaces;