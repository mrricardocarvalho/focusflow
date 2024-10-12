import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskDetailView from './TaskDetailView';
import '../styles/ListView.css';

function ListView({ tasks, updateTask }) {
  const [newTaskName, setNewTaskName] = useState('');
  const [filter, setFilter] = useState({ status: 'all', project: 'all' });
  const [selectedTask, setSelectedTask] = useState(null);

  const toggleTaskCompletion = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    updateTask({ ...task, completed: !task.completed });
  };

  const handleNewTaskSubmit = (e) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      const newTask = {
        id: Date.now(),
        name: newTaskName,
        assignee: '',
        dueDate: '',
        project: '',
        completed: false,
        description: '',
        status: 'todo'
      };
      updateTask(newTask);
      setNewTaskName('');
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    items.forEach((task, index) => {
      updateTask({ ...task, order: index });
    });
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const statusMatch = filter.status === 'all' || 
        (filter.status === 'completed' && task.completed) ||
        (filter.status === 'active' && !task.completed);
      const projectMatch = filter.project === 'all' || task.project === filter.project;
      return statusMatch && projectMatch;
    });
  }, [tasks, filter]);

  const projects = useMemo(() => {
    return ['all', ...new Set(tasks.map(task => task.project))];
  }, [tasks]);

  return (
    <div className="list-view">
      <div className="filters">
        <select 
          value={filter.status} 
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="all">All tasks</option>
          <option value="active">Active tasks</option>
          <option value="completed">Completed tasks</option>
        </select>
        <select 
          value={filter.project} 
          onChange={(e) => setFilter({ ...filter, project: e.target.value })}
        >
          {projects.map(project => (
            <option key={project} value={project}>
              {project === 'all' ? 'All projects' : project}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={handleNewTaskSubmit} className="new-task-form">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Add a new task..."
          className="new-task-input"
        />
        <button type="submit" className="new-task-button">Add Task</button>
      </form>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <table {...provided.droppableProps} ref={provided.innerRef}>
              <thead>
                <tr>
                  <th></th>
                  <th>Task name</th>
                  <th>Assignee</th>
                  <th>Due date</th>
                  <th>Project</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={task.completed ? 'completed' : ''}
                        onClick={() => openTaskDetail(task)}
                      >
                        <td>
                          <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleTaskCompletion(task.id);
                            }}
                          />
                        </td>
                        <td>{task.name}</td>
                        <td>{task.assignee}</td>
                        <td>{task.dueDate}</td>
                        <td>{task.project}</td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
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

export default ListView;