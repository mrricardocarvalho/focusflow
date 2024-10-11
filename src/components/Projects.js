import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Task from './Task';

function Projects({ workspaceId }) {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/workspace/${workspaceId}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/projects', { name: projectName, workspaceId });
      setProjects([...projects, response.data]);
      setProjectName('');
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${project.id}/tasks`);
      setSelectedProject({ ...project, tasks: response.data });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:5000/api/projects/${selectedProject.id}/tasks`, {
        name: taskName,
        dueDate,
        priorityLevel
      });
      setSelectedProject({
        ...selectedProject,
        tasks: [...selectedProject.tasks, response.data]
      });
      setTaskName('');
      setDueDate('');
      setPriorityLevel('');
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTaskCompletion = async (taskId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/projects/${selectedProject.id}/tasks/${taskId}/toggle`);
      setSelectedProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === response.data.id ? response.data : task
        )
      }));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleEditTask = async (taskId, updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/projects/${selectedProject.id}/tasks/${taskId}`, updatedTask);
      setSelectedProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId ? response.data : task
        )
      }));
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${selectedProject.id}/tasks/${taskId}`);
      setSelectedProject((prev) => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== taskId)
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  return (
    <div className="projects-container">
      <div className="header">
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
      </div>
      
      <div className="project-list">
        {projects.map(project => (
          <div key={project.id} className="project-item">
            <h4>{project.name}</h4>
            <button onClick={() => handleSelectProject(project)}>
              {selectedProject?.id === project.id ? 'Hide Tasks' : 'View Tasks'}
            </button>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="task-section">
          <h4>Tasks for {selectedProject.name}</h4>
          <form onSubmit={handleCreateTask}>
            <input 
              type="text" 
              placeholder="New Task Name" 
              value={taskName} 
              onChange={(e) => setTaskName(e.target.value)} 
              required 
            />
            <input 
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)} 
            />
            <select 
              value={priorityLevel} 
              onChange={(e) => setPriorityLevel(e.target.value)}
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit">Add Task</button>
          </form>
          <div className="task-list">
            {selectedProject.tasks.map(task => (
              <Task 
                key={task.id} 
                task={task} 
                onToggle={handleToggleTaskCompletion}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;