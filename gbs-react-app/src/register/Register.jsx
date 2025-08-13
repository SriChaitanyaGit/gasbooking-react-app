import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('customer');
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 5) {
      newErrors.name = 'Name must be at least 5 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.com$/.test(email)) {
      newErrors.email = 'Enter a valid email containing @ and ending with .com';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+91[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = 'Phone must be a 10-digit number starting with +91';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
      newErrors.password = 'Must include uppercase, lowercase, number, and symbol';
    }

    if (!role) {
      newErrors.role = 'Role selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (pwd) => {
    if (pwd.length < 8) {
      setPasswordStrength('Weak');
    } else if (/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(pwd) && !/(?=.*[\W_])/.test(pwd)) {
      setPasswordStrength('Medium');
    } else if (/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])/.test(pwd)) {
      setPasswordStrength('Strong');
    } else {
      setPasswordStrength('Weak');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post('/api/create-customer', {
        name,
        email,
        address,
        phone,
        password,
        role,
      });

      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="ra-container">
      <div className="ra-card">
        <h2 className="ra-brand">AGCA GAS BOOKINGS</h2>
        <h4 className="ra-title">Register Here</h4>
        <form onSubmit={handleRegister} className="ra-form">
          <div className="ra-group">
            <label>Full Name <span>*</span></label>
            <input
              type="text"
              className={`ra-input ${errors.name ? 'ra-invalid' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={validate}
            />
            {errors.name && <div className="ra-error">{errors.name}</div>}
          </div>

          <div className="ra-group">
            <label>Email <span>*</span></label>
            <input
              type="email"
              className={`ra-input ${errors.email ? 'ra-invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validate}
            />
            {errors.email && <div className="ra-error">{errors.email}</div>}
          </div>

          <div className="ra-group">
            <label>Address</label>
            <input
              type="text"
              className="ra-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="ra-group">
            <label>Phone Number <span>*</span></label>
            <input
              type="text"
              className={`ra-input ${errors.phone ? 'ra-invalid' : ''}`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={validate}
            />
            {errors.phone && <div className="ra-error">{errors.phone}</div>}
          </div>

          <div className="ra-group">
            <label>Password <span>*</span></label>
            <input
              type="password"
              className={`ra-input ${errors.password ? 'ra-invalid' : ''}`}
              value={password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => {
                setPasswordFocused(false);
                validate();
              }}
              onChange={handlePasswordChange}
            />
            {password && passwordFocused && (
              <small className={`ra-strength ${passwordStrength.toLowerCase()}`}>
                {passwordStrength} password
              </small>
            )}
            {errors.password && <div className="ra-error">{errors.password}</div>}
          </div>

          <div className="ra-group">
            <label>Role <span>*</span></label>
            <select value={role} className="ra-input" readOnly>
              <option value="admin">Customer</option>
            </select>
            {errors.role && <div className="ra-error">{errors.role}</div>}
          </div>

          <button type="submit" className="ra-btn ra-btn--primary">Register</button>
          <button
            type="button"
            className="ra-btn ra-btn--outline"
            onClick={() => navigate('/login')}
          >
            Already registered?
          </button>
        </form>
      </div>
    </div>
  );
}
