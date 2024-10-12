import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ProjectSelector from './ProjectSelector';
import KanbanColumn from './KanbanColumn';
import '../styles/GlobalKanbanView.css';

function GlobalKanbanView() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState(['all']);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (selectedProjects.length > 0) {
        const projectIds = selectedProjects.includes('all') 
          ? projects.map(p => p.id).join(',')
          : selectedProjects.join(',');
        try {
          const response = await axios.get(`http://localhost:5000/api/projects/tasks/multi-project?projectIds=${projectIds}`);
          setTasks(response.data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      } else {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [selectedProjects, projects]);

  const handleProjectSelection = (event) => {
    const values = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedProjects(values.includes('all') ? ['all'] : values);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const [reorderedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, reorderedTask);

    setTasks(updatedTasks);

    // Here you would typically update the backend with the new task order
    // For now, we'll just update the local state
  };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="global-kanban-view">
      <ProjectSelector 
        projects={projects} 
        selectedProjects={selectedProjects} 
        onChange={handleProjectSelection} 
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          <Droppable droppableId="todo">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <KanbanColumn title="To Do" tasks={todoTasks} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="inProgress">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <KanbanColumn title="In Progress" tasks={inProgressTasks} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="done">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <KanbanColumn title="Done" tasks={doneTasks} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}

export default GlobalKanbanView;