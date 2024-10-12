import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskDetailView from './TaskDetailView';
import '../styles/BoardView.css';

function BoardView({ tasks, updateTask }) {
  const [columns, setColumns] = useState({
    'To Do': { id: 'todo', tasks: [] },
    'In Progress': { id: 'inProgress', tasks: [] },
    'Done': { id: 'done', tasks: [] }
  });
  const [selectedTask, setSelectedTask] = useState(null);

  useMemo(() => {
    const newColumns = {
      'To Do': { id: 'todo', tasks: [] },
      'In Progress': { id: 'inProgress', tasks: [] },
      'Done': { id: 'done', tasks: [] }
    };
    tasks.forEach(task => {
      if (task.completed) {
        newColumns['Done'].tasks.push(task);
      } else if (task.status === 'inProgress') {
        newColumns['In Progress'].tasks.push(task);
      } else {
        newColumns['To Do'].tasks.push(task);
      }
    });
    setColumns(newColumns);
  }, [tasks]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.tasks];
      const destItems = [...destColumn.tasks];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destItems
        }
      });

      // Update task status
      const updatedTask = {
        ...removed,
        status: destination.droppableId === 'Done' ? 'completed' : destination.droppableId.toLowerCase(),
        completed: destination.droppableId === 'Done'
      };
      updateTask(updatedTask);
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.tasks];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          tasks: copiedItems
        }
      });
    }
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
  };

  return (
    <div className="board-view">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnId, column]) => (
          <div className="board-column" key={columnId}>
            <h2>{columnId}</h2>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                          onClick={() => openTaskDetail(task)}
                        >
                          <h3>{task.name}</h3>
                          <p>{task.assignee}</p>
                          <p>{task.dueDate}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
      {selectedTask && (
        <TaskDetailView
          task={selectedTask}
          onClose={closeTaskDetail}
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}

export default BoardView;