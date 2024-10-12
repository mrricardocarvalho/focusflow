import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNavBar from './components/TopNavBar';
import ContentHeader from './components/ContentHeader';
import ListView from './components/ListView';
import BoardView from './components/BoardView';
import CalendarView from './components/CalendarView';
import TimelineView from './components/TimelineView';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Design new landing page', assignee: 'John Doe', dueDate: '2023-06-15', project: 'Website Redesign', completed: false, description: '', status: 'todo' },
    { id: 2, name: 'Update user documentation', assignee: 'Jane Smith', dueDate: '2023-06-20', project: 'Product Launch', completed: true, description: '', status: 'done' },
    { id: 3, name: 'Prepare Q2 report', assignee: 'Mike Johnson', dueDate: '2023-06-30', project: 'Quarterly Reports', completed: false, description: '', status: 'inProgress' },
  ]);
  const [viewMode, setViewMode] = useState('list');

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const renderView = () => {
    switch (viewMode) {
      case 'list':
        return <ListView tasks={tasks} updateTask={updateTask} />;
      case 'board':
        return <BoardView tasks={tasks} updateTask={updateTask} />;
      case 'calendar':
        return <CalendarView tasks={tasks} updateTask={updateTask} />;
      case 'timeline':
        return <TimelineView tasks={tasks} updateTask={updateTask} />;
      default:
        return <ListView tasks={tasks} updateTask={updateTask} />;
    }
  };

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <TopNavBar />
          <ContentHeader 
            viewMode={viewMode} 
            setViewMode={setViewMode}
          />
          <Routes>
            <Route path="/" element={renderView()} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
