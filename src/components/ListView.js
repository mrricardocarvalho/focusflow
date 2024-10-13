import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useProject } from '../contexts/ProjectContext';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import { FaFilter, FaSort, FaPlus, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import '../styles/ListView.css';

function ListView() {
  const [tasks, setTasks] = useState([]);
  const { currentProject } = useProject();
  const [sections, setSections] = useState(['To Do', 'In Progress', 'Done']);
  const [expandedSections, setExpandedSections] = useState({});
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (currentProject) {
      try {
        const response = await getTasks(currentProject._id);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
  }, [currentProject]);

  useEffect(() => {
    fetchTasks();
    setExpandedSections({
      'To Do': true,
      'In Progress': true,
      'Done': true
    });
  }, [fetchTasks]);

  const handleCreateTask = async (section) => {
    if (newTaskName.trim() && currentProject) {
      try {
        await createTask({ name: newTaskName, projectId: currentProject._id, section });
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

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      // Moving between sections
      const sourceSection = tasks.filter(task => task.section === source.droppableId);
      const destSection = tasks.filter(task => task.section === destination.droppableId);
      const [removed] = sourceSection.splice(source.index, 1);
      destSection.splice(destination.index, 0, removed);

      const newTasks = tasks.filter(task => task.section !== source.droppableId && task.section !== destination.droppableId)
        .concat(sourceSection)
        .concat(destSection);

      setTasks(newTasks);

      // Update task in backend
      await updateTask(removed._id, { section: destination.droppableId });
    } else {
      // Reordering within the same section
      const sectionTasks = tasks.filter(task => task.section === source.droppableId);
      const [reorderedItem] = sectionTasks.splice(source.index, 1);
      sectionTasks.splice(destination.index, 0, reorderedItem);

      const newTasks = tasks.filter(task => task.section !== source.droppableId).concat(sectionTasks);
      setTasks(newTasks);

      // Update task order in backend
      await updateTask(reorderedItem._id, { order: destination.index });
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
  };

  const addSection = () => {
    const newSection = `New Section ${sections.length + 1}`;
    setSections([...sections, newSection]);
    setExpandedSections(prev => ({...prev, [newSection]: true}));
  };

  return (
    <div className="list-view">
      <div className="list-header">
        <button className="add-task-btn"><FaPlus /> Add Task</button>
        <div className="list-controls">
          <button><FaFilter /> Filter</button>
          <button><FaSort /> Sort</button>
        </div>
      </div>
      <div className="list-columns">
        <div className="column">Task Name</div>
        <div className="column">Assignee</div>
        <div className="column">Due Date</div>
        <div className="column">Priority</div>
        <div className="column">Status</div>
        <div className="column">Tags</div>
        <div className="column"><FaPlus /></div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        {sections.map((section) => (
          <div key={section} className="task-section">
            <div className="section-header" onClick={() => toggleSection(section)}>
              {expandedSections[section] ? <FaChevronDown /> : <FaChevronRight />}
              <h3>{section}</h3>
            </div>
            {expandedSections[section] && (
              <Droppable droppableId={section}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks.filter(task => task.section === section).map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-item"
                          >
                            <div className="column">{task.name}</div>
                            <div className="column">{task.assignee}</div>
                            <div className="column">{new Date(task.dueDate).toLocaleDateString()}</div>
                            <div className="column">{task.priority}</div>
                            <div className="column">{task.status}</div>
                            <div className="column">{task.tags.join(', ')}</div>
                            <div className="column"></div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <div className="task-item new-task">
                      <div className="column">
                        <input
                          type="text"
                          value={newTaskName}
                          onChange={(e) => setNewTaskName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleCreateTask(section);
                            }
                          }}
                          placeholder="Add task..."
                        />
                      </div>
                      <div className="column"></div>
                      <div className="column"></div>
                      <div className="column"></div>
                      <div className="column"></div>
                      <div className="column"></div>
                      <div className="column"></div>
                    </div>
                  </div>
                )}
              </Droppable>
            )}
          </div>
        ))}
      </DragDropContext>
      <button className="add-section-btn" onClick={addSection}><FaPlus /> Add Section</button>
    </div>
  );
}

export default ListView;