import React, { useState, useEffect } from 'react';
import TaskDetailView from './TaskDetailView';
import { getTasks, updateTask } from '../services/api';
import '../styles/TimelineView.css';

function TimelineView() {
  const [tasks, setTasks] = useState([]);
  const [timelineStart, setTimelineStart] = useState(new Date());
  const [timelineEnd, setTimelineEnd] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);

      if (response.data.length > 0) {
        // Set timeline start and end based on fetched tasks
        const dates = response.data.map(task => new Date(task.dueDate));
        setTimelineStart(new Date(Math.min(...dates)));
        setTimelineEnd(new Date(Math.max(...dates)));
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const getDaysArray = (start, end) => {
    let arr = [];
    for(let dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
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

  const handleTaskUpdate = async (updatedTask) => {
    try {
      await updateTask(updatedTask._id, updatedTask);
      fetchTasks();
      closeTaskDetail();
    } catch (err) {
      console.error('Error updating task:', err);
    }
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
              key={task._id} 
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
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}

export default TimelineView;
