import React, { useState, useEffect } from 'react';
import './Customerdashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Customerdashboard() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAgencies, setShowAgencies] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [agencies, setAgencies] = useState([]);
  const [profileDetails, setProfileDetails] = useState({ name: '', email: '', phone: '', role: '' });

  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const goBack = () => {
    setShowAgencies(false);
    setShowBookings(false);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your feedback!');
    setFeedbackMessage('');
  };

  const handleBookGas = (agency) => {
    navigate('/bookgas', { state: { agency } });
  };

  const handleLogout = () => {
    localStorage.removeItem('customer');
    navigate('/login');
  };

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem('customer'));
    if (!customer) {
      navigate('/login');
    } else {
      setProfileDetails({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role
      });
    }
  fetch('http://localhost:8080/api/admin/all-gas-agencies')
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch agencies");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Fetched agency data:", data);
      setAgencies(data);
    })
    .catch((error) => {
      console.error("Error fetching agencies:", error);
      setAgencies([]); // Fallback to empty array
    });
}, []);
  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <marquee>AGCA GAS BOOKINGS</marquee>
        </div>
        <div className="profile-dropdown">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
            alt="Profile"
            className="profile-icon"
            onClick={toggleDropdown}
          />
          {showDropdown && (
            <div className="dropdown-content">
              <p><strong>Name:</strong> {profileDetails.name}</p>
              <p><strong>Email:</strong> {profileDetails.email}</p>
              <p><strong>Phone:</strong> {profileDetails.phone}</p>
              <p><strong>Role:</strong> {profileDetails.role}</p>
              <button onClick={() => alert("Profile details already shown here.")}>View Profile</button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {!showAgencies && !showBookings && (
        <div className="dashboard">
          <div className="banner">
            <div className="banner-text">
              <h1>Welcome, {profileDetails.name}!</h1>
              <p>Manage your gas bookings with ease. Book, track, and get support — all in one place.</p>
              <div className="banner-buttons">
                <button onClick={() => setShowAgencies(true)}>View Agencies</button>
                <button onClick={() => setShowBookings(true)}>Track My Bookings</button>
              </div>
            </div>
            <div className="banner-image">
              <img src="https://cdn-icons-png.flaticon.com/512/2933/2933245.png" alt="Gas Booking" />
            </div>
          </div>

          <h2 className="section-title">Our Services</h2>
          <div className="features">
            <div className="feature-card">
              <img src="https://cdn-icons-png.flaticon.com/512/2983/2983795.png" alt="Book Gas" />
              <h3>Book Gas Cylinder</h3>
              <p>Quickly book domestic or commercial cylinders.</p>
            </div>
            <div className="feature-card">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Track" />
              <h3>Track Bookings</h3>
              <p>Check the status of your gas bookings anytime.</p>
            </div>
            <div className="feature-card">
              <img src="https://cdn-icons-png.flaticon.com/512/1048/1048944.png" alt="Support" />
              <h3>Customer Support</h3>
              <p>24/7 support for all your gas-related issues.</p>
            </div>
          </div>

          <div className="feedback-section">
            <h2>Feedback</h2>
            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                placeholder="Share your experience or suggestions..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                required
              />
              <button type="submit">Submit Feedback</button>
            </form>
          </div>
        </div>
      )}

      {showAgencies && (
        <div className="agency-list">
          <h2>Available Gas Agencies</h2>
          <table className="agency-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Domestic Cylinders</th>
                <th>Commercial Cylinders</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(agencies) && agencies.length > 0 ? (
  agencies.map((agency) => (
    <div key={agency.gasid} className="agency-card">
      <h3>{agency.name}</h3>
      <p>Location: {agency.location}</p>
      <p>Domestic Cylinders: {agency.domesticCylinders}</p>
      <p>Commercial Cylinders: {agency.commercialCylinders}</p>
      <button onClick={() => handleBook(agency)}>Book Gas</button>
    </div>
  ))
) : (
  <p>No agencies available.</p>
)}
            </tbody>
          </table>
          <button className="back-btn" onClick={goBack}>Back</button>
        </div>
      )}

      {showBookings && (
        <div className="bookings-section">
          <h2>Your Gas Bookings</h2>
          <p>[Booking history and tracking details can be shown here]</p>
          <button onClick={goBack}>Back</button>
        </div>
      )}

      <div className="footer">
        <p>&copy; 2025 AGCA Gas Booking System. All rights reserved.</p>
      </div>
    </div>
  );
}
