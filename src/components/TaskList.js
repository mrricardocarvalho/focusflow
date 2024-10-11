import React from 'react';
import Task from './Task';

function TaskList() {
  const tasks = [
    { id: 1, title: 'Learn React', description: 'Study React fundamentals' },
    { id: 2, title: 'Build FocusFlow', description: 'Create a task management app' },
  ];

  return (
    <div className="task-list">
      <h2>My Tasks</h2>
      {tasks.map(task => (
        <Task key={task.id} title={task.title} description={task.description} />
      ))}
    </div>
  );
}

export default TaskList;
