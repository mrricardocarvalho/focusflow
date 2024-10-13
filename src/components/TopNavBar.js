import React, { useState } from 'react';
import ProjectSelector from './ProjectSelector';
import { Link } from 'react-router-dom';
import '../styles/TopNavBar.css';

function TopNavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="top-nav-bar">
      <div className="left-section">
        <button className="home-button">
          <i className="fas fa-home"></i>
        </button>
        <ProjectSelector />
      </div>
      <div className="center-section">
        <input type="text" placeholder="Search" className="search-bar" />
      </div>
      <div className="right-section">
        <button className="icon-button">
          <i className="fas fa-plus"></i>
        </button>
        <button className="icon-button">
          <i className="fas fa-question"></i>
        </button>
        <button className="icon-button">
          <i className="fas fa-bell"></i>
        </button>
        <div className="user-menu">
          <button className="user-avatar" onClick={toggleDropdown}>
            <img src="https://via.placeholder.com/32" alt="User Avatar" />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/my-profile">My Profile Settings</Link>
              <Link to="/my-tasks">My Tasks</Link>
              <Link to="/inbox">Inbox</Link>
              <hr />
              <button onClick={() => {/* Implement logout */}}>Log Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TopNavBar;
