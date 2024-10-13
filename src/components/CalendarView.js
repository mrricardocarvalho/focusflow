import React, { useState, useEffect } from 'react';
import TaskDetailView from './TaskDetailView';
import { getTasks, updateTask } from '../services/api';
import '../styles/CalendarView.css';

function CalendarView() {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
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

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    
    let daysArray = [];
    
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysCount; day++) {
      daysArray.push(
        <div key={day} className="calendar-day">
          <span className="day-number">{day}</span>
          <div className="day-tasks">
            {tasks.filter(task => new Date(task.dueDate).getDate() === day && 
                                  new Date(task.dueDate).getMonth() === month &&
                                  new Date(task.dueDate).getFullYear() === year)
                  .map(task => (
                    <div
                      key={task._id}
                      className="calendar-task"
                      onClick={() => openTaskDetail(task)}
                    >
                      {task.name}
                    </div>
                  ))}
          </div>
        </div>
      );
    }

    return daysArray;
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        
        {renderCalendar()}
        
      </div>

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

export default CalendarView;
