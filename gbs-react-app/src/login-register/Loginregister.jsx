import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginregister.css';



export default function Loginregister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role] = useState('Customer'); // Default role
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 5) {
      newErrors.name = 'Name should be at least 5 characters';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !email.endsWith('@gmail.com') &&
      !email.endsWith('@gmail.in')
    ) {
      newErrors.email = 'Email must end with @gmail.com or @gmail.in';
    }

    // Password validation
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length <= 6) {
      newErrors.password = 'Password must be more than 6 characters';
    } else if (!(hasUpper && hasLower && hasSpecial)) {
      newErrors.password =
        'Password must include uppercase, lowercase, and special characters';
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  const checkPasswordStrength = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length <= 6 || !(hasUpper && hasLower && hasSpecial)) {
      setPasswordStrength('Weak');
    } else {
      setPasswordStrength('Strong');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post('http://localhost:8080/api/create-customer', {
        name,
        email,
        password,
        phone,
        role,
      });

      alert('Registration Successful!');
      navigate('/login');
    } catch (error) {
      alert('Registration Failed: ' + error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={validate}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validate}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={validate}
        />
        {errors.password && <p className="error">{errors.password}</p>}
        {password && !errors.password && (
          <p className={passwordStrength === 'Strong' ? 'strong' : 'weak'}>
            Password is {passwordStrength}
          </p>
        )}

        <label>Phone:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={validate}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        {/* Role (Read-only input) */}
        <label>Role:</label>
        <input type="customer" value={role} readOnly />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
