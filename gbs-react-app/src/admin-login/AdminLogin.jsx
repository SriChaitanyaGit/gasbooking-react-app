import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login-admin', {
        email,
        password,
      });

      if (response.data.status === 'success') {
        alert('Admin login successful.');
        localStorage.setItem('customer', JSON.stringify(response.data.data));
        navigate('/admin');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      setError('Error during login: ' + error.message);
    }
  };

  const navigateToRegister = () => {
    navigate('/registeradmin');
  };

  return (
    <div className="a-container">
      <form className="a-form" onSubmit={login}>
        <h2 className="a-title">Admin Login</h2>
        {error && <p className="a-error">{error}</p>}

        <label className="a-label">Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="a-input"
        />

        <label className="a-label">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassWord(e.target.value)}
          required
          className="a-input"
        />

        <input type="submit" value="Login" className="a-btn a-btn--primary" />
        <button
          type="button"
          className="a-btn a-btn--outline"
          onClick={navigateToRegister}
        >
          Don't have an account?
        </button>
      </form>
    </div>
  );
}
