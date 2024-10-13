import React from 'react';
import '../styles/FilterSort.css';

function FilterSort({ filter, setFilter, sortOption, setSortOption }) {
  return (
    <div className="filter-sort">
      <div className="filter-options">
        <select 
          value={filter.status} 
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="all">All statuses</option>
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select 
          value={filter.project} 
          onChange={(e) => setFilter({ ...filter, project: e.target.value })}
        >
          <option value="all">All projects</option>
          {/* Add project options dynamically based on available projects */}
        </select>
        <select 
          value={filter.assignee} 
          onChange={(e) => setFilter({ ...filter, assignee: e.target.value })}
        >
          <option value="all">All assignees</option>
          {/* Add assignee options dynamically based on available assignees */}
        </select>
      </div>
      <div className="sort-options">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="dueDate">Due Date</option>
          <option value="name">Task Name</option>
          <option value="status">Status</option>
          <option value="assignee">Assignee</option>
        </select>
      </div>
    </div>
  );
}

export default FilterSort;
