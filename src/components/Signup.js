import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import '../styles/Auth.css';

function Signup({ setIsAuthenticated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await signup({ name, email, password });
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError('Error creating account');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <img src="/logo.png" alt="FocusFlow Logo" className="auth-logo" />
        <h1>Sign up for FocusFlow</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
