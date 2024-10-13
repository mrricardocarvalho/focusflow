import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskDetailView from './TaskDetailView';
import FilterSort from './FilterSort';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import '../styles/ListView.css';

function ListView() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [filter, setFilter] = useState({ status: 'all', project: 'all', assignee: 'all' });
  const [sortOption, setSortOption] = useState('dueDate');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    try {
      await updateTask(taskId, { completed: !task.completed });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleNewTaskSubmit = async (e) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      try {
        await createTask({
          name: newTaskName,
          assignee: '',
          dueDate: '',
          project: '',
          completed: false,
          description: '',
          status: 'todo'
        });
        setNewTaskName('');
        fetchTasks();
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);

    try {
      await updateTask(reorderedItem._id, { order: result.destination.index });
    } catch (error) {
      console.error('Error updating task order:', error);
      fetchTasks(); // Revert to server state if update fails
    }
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      await updateTask(updatedTask._id, updatedTask);
      fetchTasks();
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const statusMatch = filter.status === 'all' || task.status === filter.status;
        const projectMatch = filter.project === 'all' || task.project === filter.project;
        const assigneeMatch = filter.assignee === 'all' || task.assignee === filter.assignee;
        return statusMatch && projectMatch && assigneeMatch;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'dueDate':
            return new Date(a.dueDate) - new Date(b.dueDate);
          case 'name':
            return a.name.localeCompare(b.name);
          case 'status':
            return a.status.localeCompare(b.status);
          case 'assignee':
            return a.assignee.localeCompare(b.assignee);
          default:
            return 0;
        }
      });
  }, [tasks, filter, sortOption]);

  const projects = useMemo(() => {
    return ['all', ...new Set(tasks.map(task => task.project))];
  }, [tasks]);

  return (
    <div className="list-view">
      <FilterSort 
        filter={filter} 
        setFilter={setFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
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
                {filteredAndSortedTasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
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
                              toggleTaskCompletion(task._id);
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
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}

export default ListView;
