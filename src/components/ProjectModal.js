import React, { useState } from 'react';
import { createProject, updateProject } from '../services/api';
import { useProject } from '../contexts/ProjectContext';
import '../styles/ProjectModal.css';

function ProjectModal({ project, onClose }) {
  const [name, setName] = useState(project ? project.name : '');
  const [description, setDescription] = useState(project ? project.description : '');
  const { fetchProjects } = useProject();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (project) {
        await updateProject(project._id, { name, description });
      } else {
        await createProject({ name, description });
      }
      fetchProjects();
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div className="project-modal-overlay">
      <div className="project-modal">
        <h2>{project ? 'Edit Project' : 'Create New Project'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="project-name">Project Name</label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="project-description">Description (optional)</label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add project description"
              rows="4"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="create-btn">{project ? 'Save Changes' : 'Create Project'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;
