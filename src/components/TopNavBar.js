import React from 'react';
import '../styles/TopNavBar.css';

function TopNavBar() {
  return (
    <nav className="top-nav-bar">
      <div className="search-bar">
        <i className="fas fa-search"></i>
        <input type="text" placeholder="Search" />
      </div>
      <div className="nav-actions">
        <button className="nav-button"><i className="fas fa-plus"></i> Create</button>
        <button className="nav-button"><i className="fas fa-question-circle"></i></button>
        <button className="nav-button"><i className="fas fa-bell"></i></button>
        <button className="nav-button"><i className="fas fa-user-circle"></i></button>
      </div>
    </nav>
  );
}

export default TopNavBar;