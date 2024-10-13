import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { getProject, getTasks, createTask, updateTask, deleteTask } from '../services/api';
import '../styles/ProjectDetails.css';

function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const { id } = useParams();
  const { setCurrentProject } = useProject();

  const fetchProject = useCallback(async () => {
    try {
      const response = await getProject(id);
      setProject(response.data);
      setCurrentProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  }, [id, setCurrentProject]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await getTasks(id);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [fetchProject, fetchTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      try {
        await createTask({ name: newTaskName, projectId: id });
        setNewTaskName('');
        fetchTasks();
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await updateTask(taskId, updates);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-details">
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <form onSubmit={handleCreateTask} className="new-task-form">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Add new task..."
        />
        <button type="submit">Add Task</button>
      </form>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleUpdateTask(task._id, { completed: !task.completed })}
            />
            <span className={task.completed ? 'completed' : ''}>{task.name}</span>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectDetails;
