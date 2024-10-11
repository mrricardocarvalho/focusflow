import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import TaskList from './components/TaskList';
import Register from './components/Register';
import Login from './components/Login';
import Workspaces from './components/Workspaces';
import Inbox from './components/Inbox';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/workspaces" element={<Workspaces />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;