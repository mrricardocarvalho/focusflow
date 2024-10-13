import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import '../styles/Auth.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await resetPassword(token, password);
      setMessage('Password has been reset successfully');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('Error resetting password. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <img src="/logo.png" alt="FocusFlow Logo" className="auth-logo" />
        <h1>Reset Your Password</h1>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              required
            />
          </div>
          <button type="submit" className="auth-button">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
