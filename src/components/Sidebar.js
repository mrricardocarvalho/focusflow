import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [workspacesExpanded, setWorkspacesExpanded] = useState(true);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [workspacesDropdownOpen, setWorkspacesDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [projectsSortOption, setProjectsSortOption] = useState('alphabetical');
  const [workspacesSortOption, setWorkspacesSortOption] = useState('custom');

  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setProjectsDropdownOpen(false);
        setWorkspacesDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProjects = () => setProjectsExpanded(!projectsExpanded);
  const toggleWorkspaces = () => setWorkspacesExpanded(!workspacesExpanded);

  const toggleProjectsDropdown = (e) => {
    e.stopPropagation();
    setProjectsDropdownOpen(!projectsDropdownOpen);
  };

  const toggleWorkspacesDropdown = (e) => {
    e.stopPropagation();
    setWorkspacesDropdownOpen(!workspacesDropdownOpen);
  };

  const addProject = (e) => {
    e.stopPropagation();
    const projectName = prompt("Enter new project name:");
    if (projectName) {
      setProjects([...projects, { id: Date.now(), name: projectName }]);
      setProjectsExpanded(true);
      setProjectsDropdownOpen(false);
    }
  };

  const addWorkspace = (e) => {
    e.stopPropagation();
    const workspaceName = prompt("Enter new workspace name:");
    if (workspaceName) {
      setWorkspaces([...workspaces, { id: Date.now(), name: workspaceName }]);
      setWorkspacesExpanded(true);
      setWorkspacesDropdownOpen(false);
    }
  };

  const handleSortProjects = (option) => {
    setProjectsSortOption(option);
    setProjectsDropdownOpen(false);
    // Here you would add logic to actually sort the projects
  };

  const handleSortWorkspaces = (option) => {
    setWorkspacesSortOption(option);
    setWorkspacesDropdownOpen(false);
    // Here you would add logic to actually sort the workspaces
  };

  const getConsistentColor = (id) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    return colors[id % colors.length];
  };

  return (
    <aside className="sidebar" ref={sidebarRef}>
      <h1>FocusFlow</h1>
      <nav>
        <ul>
          <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
          <li><Link to="/tasks"><i className="fas fa-tasks"></i> My Tasks</Link></li>
          <li><Link to="/inbox"><i className="fas fa-bell"></i> Inbox</Link></li>
          <hr className="sidebar-divider" />
          <li className="sidebar-section">
            <div className="section-header" onClick={toggleProjects}>
              <i className={`fas fa-chevron-${projectsExpanded ? 'down' : 'right'}`}></i>
              <span>Projects</span>
              <div className="section-actions">
                <i className="fas fa-chevron-down" onClick={toggleProjectsDropdown}></i>
                <i className="fas fa-plus" onClick={(e) => addProject(e)}></i>
              </div>
            </div>
            {projectsDropdownOpen && (
              <ul className="dropdown-menu">
                <li onClick={(e) => addProject(e)}>Create new project</li>
                <li className="sort-header">
                  Sort Projects
                  <ul className="sort-options">
                    <li onClick={() => handleSortProjects('alphabetical')}>
                      <span className="sort-checkbox">
                        {projectsSortOption === 'alphabetical' && <i className="fas fa-check"></i>}
                      </span>
                      Alphabetical
                    </li>
                    <li onClick={() => handleSortProjects('recent')}>
                      <span className="sort-checkbox">
                        {projectsSortOption === 'recent' && <i className="fas fa-check"></i>}
                      </span>
                      Recent
                    </li>
                    <li onClick={() => handleSortProjects('top')}>
                      <span className="sort-checkbox">
                        {projectsSortOption === 'top' && <i className="fas fa-check"></i>}
                      </span>
                      Top
                    </li>
                  </ul>
                </li>
              </ul>
            )}
            {projectsExpanded && (
              <ul className="sub-menu">
                {projects.map(project => (
                  <li key={project.id}>
                    <i className="fas fa-circle" style={{color: getConsistentColor(project.id)}}></i>
                    {project.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="sidebar-section">
            <div className="section-header" onClick={toggleWorkspaces}>
              <i className={`fas fa-chevron-${workspacesExpanded ? 'down' : 'right'}`}></i>
              <span>Workspaces</span>
              <i className="fas fa-chevron-down" onClick={toggleWorkspacesDropdown}></i>
            </div>
            {workspacesDropdownOpen && (
              <ul className="dropdown-menu">
                <li onClick={(e) => addWorkspace(e)}>Create new workspace</li>
                <li className="sort-header">
                  Sort Workspaces
                  <ul className="sort-options">
                    <li onClick={() => handleSortWorkspaces('custom')}>
                      <span className="sort-checkbox">
                        {workspacesSortOption === 'custom' && <i className="fas fa-check"></i>}
                      </span>
                      Custom
                    </li>
                    <li onClick={() => handleSortWorkspaces('alphabetical')}>
                      <span className="sort-checkbox">
                        {workspacesSortOption === 'alphabetical' && <i className="fas fa-check"></i>}
                      </span>
                      Alphabetical
                    </li>
                  </ul>
                </li>
              </ul>
            )}
            {workspacesExpanded && (
              <ul className="sub-menu">
                {workspaces.map(workspace => (
                  <li key={workspace.id}>
                    <i className="fas fa-users"></i>
                    {workspace.name}
                    <i className="fas fa-chevron-right"></i>
                  </li>
                ))}
                <li onClick={(e) => addWorkspace(e)}><i className="fas fa-plus"></i> Add Workspace</li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;