import React from 'react';
import '../styles/ContentHeader.css';

function ContentHeader({ viewMode, setViewMode }) {
  return (
    <header className="content-header">
      <h1>Project Name</h1>
      <div className="header-actions">
        <div className="view-switcher">
          <button 
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
          <button 
            className={`view-button ${viewMode === 'board' ? 'active' : ''}`}
            onClick={() => setViewMode('board')}
          >
            Board
          </button>
          <button 
            className={`view-button ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </button>
          <button 
            className={`view-button ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </button>
        </div>
        <button className="header-button"><i className="fas fa-share"></i> Share</button>
        <button className="header-button"><i className="fas fa-ellipsis-h"></i></button>
      </div>
    </header>
  );
}

export default ContentHeader;
