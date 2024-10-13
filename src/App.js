import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ProjectProvider } from './contexts/ProjectContext';
import Sidebar from './components/Sidebar';
import TopNavBar from './components/TopNavBar';
import ContentHeader from './components/ContentHeader';
import ListView from './components/ListView';
import BoardView from './components/BoardView';
import CalendarView from './components/CalendarView';
import TimelineView from './components/TimelineView';
import ProjectDetails from './components/ProjectDetails';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState('list');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const renderView = () => {
    switch (viewMode) {
      case 'list':
        return <ListView />;
      case 'board':
        return <BoardView />;
      case 'calendar':
        return <CalendarView />;
      case 'timeline':
        return <TimelineView />;
      default:
        return <ListView />;
    }
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <ProjectProvider>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TopNavBar />
                  <div className="main-container">
                    <Sidebar />
                    <div className="content">
                      <ContentHeader viewMode={viewMode} setViewMode={setViewMode} />
                      {renderView()}
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/project/:id"
              element={
                <PrivateRoute>
                  <TopNavBar />
                  <div className="main-container">
                    <Sidebar />
                    <div className="content">
                      <ProjectDetails />
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </ProjectProvider>
    </Router>
  );
}

export default App;
