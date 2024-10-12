import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [teamsExpanded, setTeamsExpanded] = useState(true);
  const [favorites] = useState([
    { id: 1, name: 'Important Project', icon: 'star' },
    { id: 2, name: 'Urgent Tasks', icon: 'exclamation-circle' }
  ]);
  const [projects] = useState([
    { id: 1, name: 'Marketing Campaign' },
    { id: 2, name: 'Product Launch' },
    { id: 3, name: 'Q4 Planning' }
  ]);
  const [teams] = useState([
    { id: 1, name: 'Design Team' },
    { id: 2, name: 'Development Team' },
    { id: 3, name: 'Marketing Team' }
  ]);

  const toggleProjects = () => setProjectsExpanded(!projectsExpanded);
  const toggleTeams = () => setTeamsExpanded(!teamsExpanded);

  return (
    <aside className="sidebar">
      <h1>FocusFlow</h1>
      <nav>
        <ul>
          <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
          <li><Link to="/tasks"><i className="fas fa-tasks"></i> My Tasks</Link></li>
          <li><Link to="/inbox"><i className="fas fa-inbox"></i> Inbox</Link></li>
          <li><Link to="/global-kanban"><i className="fas fa-columns"></i> Global Kanban</Link></li>
        </ul>

        <div className="sidebar-section">
          <h3>Favorites</h3>
          <ul>
            {favorites.map(fav => (
              <li key={fav.id}>
                <Link to={`/project/${fav.id}`}>
                  <i className={`fas fa-${fav.icon}`}></i> {fav.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h3 onClick={toggleProjects}>
            Projects
            <i className={`fas fa-chevron-${projectsExpanded ? 'down' : 'right'}`}></i>
          </h3>
          {projectsExpanded && (
            <ul>
              {projects.map(project => (
                <li key={project.id}>
                  <Link to={`/project/${project.id}`}>
                    <i className="fas fa-circle"></i> {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button className="new-project-btn">
            <i className="fas fa-plus"></i> New Project
          </button>
        </div>

        <div className="sidebar-section">
          <h3 onClick={toggleTeams}>
            Teams
            <i className={`fas fa-chevron-${teamsExpanded ? 'down' : 'right'}`}></i>
          </h3>
          {teamsExpanded && (
            <ul>
              {teams.map(team => (
                <li key={team.id}>
                  <Link to={`/team/${team.id}`}>
                    <i className="fas fa-users"></i> {team.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;