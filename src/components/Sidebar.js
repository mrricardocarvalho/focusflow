import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import ProjectModal from './ProjectModal';
import '../styles/Sidebar.css';

function Sidebar() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const { projects } = useProject();

  return (
    <div className="sidebar">
      <h2>FocusFlow</h2>
      <nav>
        <ul>
          <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
          <li><Link to="/my-tasks"><i className="fas fa-tasks"></i> My Tasks</Link></li>
          <li><Link to="/inbox"><i className="fas fa-inbox"></i> Inbox</Link></li>
        </ul>
      </nav>
      <div className="projects-section">
        <div className="projects-header">
          <button 
            className="toggle-projects" 
            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
          >
            <i className={`fas fa-chevron-${isProjectsExpanded ? 'down' : 'right'}`}></i>
            <h3>Projects</h3>
          </button>
          <button className="new-project-btn" onClick={() => setIsProjectModalOpen(true)}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
        {isProjectsExpanded && (
          <ul className="projects-list">
            {projects.map(project => (
              <li key={project._id}>
                <Link to={`/project/${project._id}`}>
                  <i className="fas fa-circle" style={{color: project.color || '#6f7782'}}></i>
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {isProjectModalOpen && (
        <ProjectModal onClose={() => setIsProjectModalOpen(false)} />
      )}
    </div>
  );
}

export default Sidebar;
