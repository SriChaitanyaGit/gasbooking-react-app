import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const res = await axios.post('api/login-customer', loginData);

      if (res.data.status === 'success') {
        const role = res.data.data;

        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'customer') {
          sessionStorage.setItem('email', email);
          sessionStorage.setItem('password', password);
          navigate('/customer-dashboard');
        }
      } else {
        alert('Login failed: ' + res.data.message);
      }
    } catch (error) {
      alert('Login error');
    }
  };

  const navigateToRegister = () => {
    navigate('/customer-register');
  };

  return (
    <div className="l-container">
      <h2 className="l-title">Customer Login</h2>
      <form className="l-form" onSubmit={onLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="l-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="l-input"
        />

        <button type="submit" className="l-btn l-btn--primary">Login</button>
        <button
          type="button"
          className="l-btn l-btn--outline"
          onClick={navigateToRegister}
        >
          Don't have an account?
        </button>
      </form>
    </div>
  );
}
