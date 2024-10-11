import React, { useState } from 'react';

function Task({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate);
  const [editedPriority, setEditedPriority] = useState(task.priorityLevel);

  const handleEdit = () => {
    onEdit(task.id, { name: editedName, dueDate: editedDueDate, priorityLevel: editedPriority });
    setIsEditing(false);
  };

  return (
    <div className="task-item">
      <input 
        type="checkbox" 
        checked={task.completed} 
        onChange={() => onToggle(task.id)} 
        className="task-checkbox"
      />
      {isEditing ? (
        <>
          <input 
            type="text" 
            value={editedName} 
            onChange={(e) => setEditedName(e.target.value)} 
          />
          <input 
            type="date" 
            value={editedDueDate} 
            onChange={(e) => setEditedDueDate(e.target.value)} 
          />
          <select 
            value={editedPriority} 
            onChange={(e) => setEditedPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={handleEdit}>Save</button>
        </>
      ) : (
        <>
          <span className="task-name">{task.name}</span>
          <span className="task-due-date">Due: {task.dueDate}</span>
          <span className="task-priority">Priority: {task.priorityLevel}</span>
          <div className="task-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Task;