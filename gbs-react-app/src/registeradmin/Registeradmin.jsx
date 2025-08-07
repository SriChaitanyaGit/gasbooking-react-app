import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './registeradmin.css';

const Registeradmin = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin',
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  // Field validation logic
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'username':
        if (!value || value.length < 5) {
          error = 'Username must be at least 5 characters long.';
        }
        break;
      case 'email':
        if (!value.endsWith('@gmail.com')) {
          error = 'Email must end with @gmail.com';
        }
        break;
      case 'phone':
        if (!/^\+91[6-9]\d{9}$/.test(value)) {
          error = 'Phone must start with +91 and be 13 digits total (e.g., +919876543210)';
        }
        break;
      case 'password':
        if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])(?=.*\d).{6,}$/.test(value)) {
          error = 'Password must be 6+ characters, with uppercase, lowercase, number, and special character.';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') checkPasswordStrength(value);

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError }));
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return setPasswordStrength('weak');
    if (/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(password) && !/(?=.*[\W_])/.test(password)) {
      return setPasswordStrength('medium');
    }
    if (/(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])/.test(password)) {
      return setPasswordStrength('strong');
    }
    return setPasswordStrength('weak');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run all validations before submit
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'role') {
        const err = validateField(key, value);
        if (err) newErrors[key] = err;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await axios.post('http://localhost:8080/api/create-admin', formData);
      alert('Admin registered successfully!');
      navigate('/login-admin');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div className="register-container">
      <h2>Admin Registration</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        {/* Username */}
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleChange}
          required
        />
        {errors.username && <p className="error">{errors.username}</p>}

        {/* Email */}
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        {/* Phone */}
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleChange}
          required
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        {/* Password */}
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onFocus={() => setPasswordFocused(true)}
          onBlur={(e) => {
            setPasswordFocused(false);
            handleChange(e);
          }}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        {/* Password Strength Indicator */}
        {passwordFocused && (
          <div className={`strength ${passwordStrength}`}>
            Strength: {passwordStrength}
          </div>
        )}

        {/* Role */}
        <label>Role:</label>
        <input type="text" value="admin" disabled />

        {/* Submit */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registeradmin;
