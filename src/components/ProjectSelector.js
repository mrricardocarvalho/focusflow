import React from 'react';

function ProjectSelector({ projects, selectedProjects, onChange }) {
  return (
    <select multiple value={selectedProjects} onChange={onChange}>
      <option value="all">All Projects</option>
      {projects.map(project => (
        <option key={project.id} value={project.id}>{project.name}</option>
      ))}
    </select>
  );
}

export default ProjectSelector;