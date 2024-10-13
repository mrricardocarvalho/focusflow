import React from 'react';
import { useProject } from '../contexts/ProjectContext';
import '../styles/ProjectSelector.css';

function ProjectSelector() {
  const { projects, currentProject, setCurrentProject } = useProject();

  return (
    <div className="project-selector">
      <select
        value={currentProject?._id || ''}
        onChange={(e) => setCurrentProject(projects.find(p => p._id === e.target.value))}
      >
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProjectSelector;
