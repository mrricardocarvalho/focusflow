import React, { useState } from 'react';
import TaskDetailView from './TaskDetailView';
import '../styles/CalendarView.css';

function CalendarView({ tasks, updateTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);

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

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const days = [];
  
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
  
    for (let day = 1; day <= daysCount; day++) {
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.getFullYear() === year && 
               taskDate.getMonth() === month && 
               taskDate.getDate() === day;
      });
  
      days.push(
        <div key={day} className="calendar-day">
          <span className="day-number">{day}</span>
          <div className="day-tasks">
            {dayTasks.map(task => (
              <div
                key={task.id}
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
  
    return days;
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
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}

export default CalendarView;
