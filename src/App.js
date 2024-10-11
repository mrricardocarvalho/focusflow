import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import TaskList from './components/TaskList';
import Register from './components/Register';
import Login from './components/Login';
import Workspaces from './components/Workspaces';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/workspaces">Workspaces</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/workspaces" element={<Workspaces />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;