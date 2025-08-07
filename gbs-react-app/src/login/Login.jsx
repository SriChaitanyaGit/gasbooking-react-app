// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ for navigation
import './login.css';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ initialize router navigation

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login-customer', {
        email,
        password
      });

      if (response.data.status === 'success') {
       

        // ✅ Save customer info to localStorage
        localStorage.setItem('customer', JSON.stringify(response.data.data));

        // ✅ Navigate to customer dashboard
        navigate('/customer-dashboard');
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
        <h2>Customer Login</h2>
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
