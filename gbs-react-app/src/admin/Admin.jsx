import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './admin.css';


export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/login-admin', {
        email,
        password,
      });

      if (response.data.status === 'success') {
        alert('Admin login successful.');
        localStorage.setItem('customer', JSON.stringify(response.data.data));
        navigate('/admin-dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      setError('Error during login: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={login}>
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}

        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassWord(e.target.value)}
          required
        />

        <input type="submit" value="Login" className="login-btn" />
      </form>
    </div>
  );
}
