import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

function KanbanColumn({ title, tasks }) {
  return (
    <div className="kanban-column">
      <h3>{title}</h3>
      {tasks.map((task, index) => (
        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="task-card"
            >
              <h4>{task.name}</h4>
              <p>Project: {task.projectName}</p>
              <p>Due: {task.dueDate}</p>
              <p>Priority: {task.priorityLevel}</p>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
}

export default KanbanColumn;