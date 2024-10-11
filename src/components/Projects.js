import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Projects({ workspaceId }) {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${workspaceId}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/projects', { name: projectName, workspaceId });
      setProjects([...projects, response.data]);
      setProjectName('');
      alert('Project created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating project');
    }
  };

  return (
    <div>
      <h3>Projects</h3>
      <form onSubmit={handleCreateProject}>
        <input 
          type="text" 
          placeholder="New Project Name" 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)} 
          required 
        />
        <button type="submit">Create Project</button>
      </form>
      
      {projects.length > 0 ? (
        <ul>
          {projects.map(project => (
            <li key={project.id}>{project.name}</li>
          ))}
        </ul>
      ) : (
        <p>No projects yet. Create one to get started!</p>
      )}
    </div>
  );
}

export default Projects;