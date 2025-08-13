// src/home/Home.jsx
import React from 'react';
import './Home.css';
import customerImg from '../assets/customer.jpg';
import adminImg from '../assets/image.png';

export default function Home() {
  return (
    <div className="h-container">
      {/* Navbar */}
     <nav className="h-nav">
  <div className="h-nav__logo">
    <marquee>AGCA GAS Bookings</marquee>
  </div>
  <div className="h-nav__links">
    <a href="/">Home</a>
    <a href="/login">Customer Login</a>
    <a href="/customer-register">Customer Register</a>
    <a href="/login-admin">Admin Login</a>
    <a href="/registeradmin">Admin Register</a>
  </div>
</nav>


      {/* Hero Section */}
      <section className="h-hero">
        <h1 className="h-hero__title">Welcome to AGCA Gas Booking System</h1>
        <p className="h-hero__subtitle">Fast • Reliable • Affordable Gas Booking Service</p>
      </section>

      {/* Customer & Admin Panels */}
      <section className="h-panels">
        {/* Customer Panel */}
        <div className="h-panel h-panel--c">
          <img src={customerImg} alt="Customer Portal" className="h-panel__img" />
          <h2 className="h-panel__title">Customer Portal</h2>
          <p className="h-panel__desc">Book cylinders, track orders, and manage payments seamlessly.</p>
          <div className="h-panel__actions">
            <a href="/login" className="h-btn h-btn--primary">Customer Login</a>
            <a href="/customer-register" className="h-btn h-btn--outline">Register</a>
          </div>
        </div>

        {/* Admin Panel */}
        <div className="h-panel h-panel--a">
          <img src={adminImg} alt="Admin Panel" className="h-panel__img" />
          <h2 className="h-panel__title">Admin Panel</h2>
          <p className="h-panel__desc">Manage customer bookings, view payments, and oversee operations.</p>
          <div className="h-panel__actions">
            <a href="/login-admin" className="h-btn h-btn--primary">Admin Login</a>
            <a href="/registeradmin" className="h-btn h-btn--outline">Register</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-footer">
  <div className="h-footer__content">
    <div className="h-footer__section">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/login">Customer Login</a></li>
        <li><a href="/customer-register">Customer Register</a></li>
        <li><a href="/login-admin">Admin Login</a></li>
        <li><a href="/registeradmin">Admin Register</a></li>
      </ul>
    </div>
    <div className="h-footer__section">
      <h3>Support</h3>
      <ul>
        <li><a href="#">FAQs</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms & Conditions</a></li>
      </ul>
    </div>
    <div className="h-footer__section">
      <h3>Contact Us</h3>
      <ul>
        <li><a href="mailto:support@agca.com">support@agca.com</a></li>
        <li><a href="tel:+919876543210">+91 98765 43210</a></li>
      </ul>
    </div>
  </div>
  <div className="h-footer__bottom">
    <p>© 2025 AGCA Gas Bookings. All rights reserved. | Designed with ❤️ for customers.</p>
  </div>
</footer>

    </div>
  );
}
