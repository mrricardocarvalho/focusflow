import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import '../styles/Auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await forgotPassword({ email });
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (err) {
      setError('Error sending password reset email');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <img src="/logo.png" alt="FocusFlow Logo" className="auth-logo" />
        <h1>Reset your password</h1>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
          </div>
          <button type="submit" className="auth-button">Send Reset Link</button>
        </form>
        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
