// src/home/Home.jsx
import React from 'react';
import './Home.css';
import customerImg from '../assets/customer.jpg';
import adminImg from '../assets/admin.png';

export default function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <marquee>AGCA GAS Bookings</marquee>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/login">Customer</a>
          <a href="/login-admin">Admin</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to AGCA Gas Booking System</h1>
        <p>Fast • Reliable • Affordable Gas Booking Service</p>
      </section>

      {/* Customer & Admin Panels */}
      <section className="split-panels">
        {/* Customer Panel */}
        <div className="panel">
          <img src={customerImg} alt="Customer Portal" />
          <h2>Customer Portal</h2>
          <p>Book cylinders, track orders, and manage payments seamlessly.</p>
          <div className="buttons">
            <a href="/login" className="btn">Customer Login</a>
            <a href="/register" className="btn-outline">Register</a>
          </div>
        </div>

        {/* Admin Panel */}
        <div className="panel">
          <img src={adminImg} alt="Admin Panel" />
          <h2>Admin Panel</h2>
          <p>Manage customer bookings, view payments, and oversee operations.</p>
          <div className="buttons">
            <a href="/login-admin" className="btn">Admin Login</a>
            <a href="/registeradmin" className="btn-outline">Register</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/login">Customer</a></li>
              <li><a href="/login-admin">Admin</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@agca.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 AGCA Gas Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
