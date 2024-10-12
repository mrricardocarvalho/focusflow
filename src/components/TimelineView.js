import React, { useState, useEffect } from 'react';
import TaskDetailView from './TaskDetailView';
import '../styles/TimelineView.css';

function TimelineView({ tasks, updateTask }) {
  const [timelineStart, setTimelineStart] = useState(new Date());
  const [timelineEnd, setTimelineEnd] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (tasks.length > 0) {
      const dates = tasks.map(task => new Date(task.dueDate));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      
      setTimelineStart(new Date(minDate.getFullYear(), minDate.getMonth(), 1));
      setTimelineEnd(new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0));
    }
  }, [tasks]);

  const getDaysArray = (start, end) => {
    const arr = [];
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
  };

  const daysArray = getDaysArray(timelineStart, timelineEnd);

  return (
    <div className="timeline-view">
      <div className="timeline-header">
        {daysArray.map(date => (
          <div key={date.toISOString()} className="timeline-day">
            {date.getDate() === 1 && (
              <div className="month-label">
                {date.toLocaleString('default', { month: 'short' })}
              </div>
            )}
            <div className="day-label">{date.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="timeline-body">
        {tasks.map(task => {
          const taskStart = new Date(task.dueDate);
          const dayIndex = daysArray.findIndex(d => 
            d.getFullYear() === taskStart.getFullYear() &&
            d.getMonth() === taskStart.getMonth() &&
            d.getDate() === taskStart.getDate()
          );
          return (
            <div 
              key={task.id} 
              className="timeline-task"
              style={{ 
                left: `${dayIndex * 40}px`,
                width: '80px'
              }}
              onClick={() => openTaskDetail(task)}
            >
              {task.name}
            </div>
          );
        })}
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

export default TimelineView;
