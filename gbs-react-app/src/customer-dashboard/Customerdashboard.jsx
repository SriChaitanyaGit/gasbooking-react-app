import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Customerdashboard.css";
import { 
  FaGasPump, 
  FaMapMarkerAlt, 
  FaHome, 
  FaBuilding, 
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFire,
  FaArrowUp,
  FaPaperPlane,
  FaCommentDots,
  FaSignOutAlt,
  FaUpload,
  FaIdCard,
  FaArrowLeft,
  FaRegCalendarCheck
} from "react-icons/fa";
/**
 * Full Customer Dashboard component
 * - Fetches profile & bookings
 * - Shows agencies list and bookings
 * - Cancel booking (DELETE /api/delete-booking/{id})
 * - Make payment (POST /api/hold-booking then mark UI as IN PROGRESS and navigate to /payment)
 *
 * IMPORTANT:
 * - Uses backend endpoints that exist in your BookingController:
 *    GET  /api/customer-bookings?email=...
 *    DELETE /api/delete-booking/{id}
 *    POST /api/hold-booking
 *  If your payment flow endpoints differ, replace /api/hold-booking with the correct payment/create API.
 */

export default function Customerdashboard() {
  const [customerName, setCustomerName] = useState("");
  const [profileDetails, setProfileDetails] = useState({});
  const [photoUrl, setPhotoUrl] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [showAgencies, setShowAgencies] = useState(false);
  const [agencies, setAgencies] = useState([]);

  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [email, setEmail] = useState("");

  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingAgencies, setLoadingAgencies] = useState(false);

  const navigate = useNavigate();

  // ---------- On mount: load profile (from session) and initial photo ----------
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedPassword = sessionStorage.getItem("password");
    // if not logged in, send to login
    if (!storedEmail || !storedPassword) {
      navigate("/login");
      return;
    }

    setEmail(storedEmail);
    // photo saved in localStorage as base64
    const storedPhoto = localStorage.getItem(`photo_${storedEmail}`);
    setPhotoUrl(storedPhoto || "assets/default-profile.png");

    // load user profile details (if you have endpoint for profile, use it)
    // In your earlier code you used /api/customer-profile (POST). Keep that here:
    axios
      .post("/api/customer-profile", { email: storedEmail, password: storedPassword })
      .then((res) => {
        if (res.data?.status === "success") {
          setCustomerName(res.data.data.name || "");
          setProfileDetails(res.data.data || {});
          // ensure customerId is present for bookings fetch
          if (res.data.data?.id) sessionStorage.setItem("customerId", res.data.data.id);
        } else {
          console.warn("Profile fetch returned non-success:", res.data);
          // fallback: still try to fetch bookings by email
        }
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        // best-effort: continue — bookings fetch below uses session email
      });
  }, [navigate]);

  // ---------- Helper: normalize status (case-insensitive) ----------
  const normalize = (s) => (typeof s === "string" ? s.trim().toUpperCase() : "");

  // ---------- View agencies ----------
  const viewAgencies = () => {
    setLoadingAgencies(true);
    axios
      .get("/api/admin/all-gas-agencies")
      .then((res) => {
        if (res.data?.status === "success") {
          setAgencies(res.data.data || []);
          setShowAgencies(true);
          setShowBookings(false);
        } else {
          alert(res.data?.message || "Failed to load agencies");
        }
      })
      .catch((err) => {
        console.error("Error loading agencies:", err);
        alert("Server error loading agencies");
      })
      .finally(() => setLoadingAgencies(false));
  };

  // ---------- View bookings for the logged-in email ----------
  const viewBookings = () => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      alert("Please log in first");
      navigate("/login");
      return;
    }

    setLoadingBookings(true);
    axios
      .get(`/api/customer-bookings?email=${encodeURIComponent(storedEmail)}`)
      .then((res) => {
        if (res.data?.status === "success") {
          // controller returns ResponseData with data = List<BookingDTO>
          const list = res.data.data || [];
          setBookings(list);
          setShowBookings(true);
          setShowAgencies(false);
        } else {
          console.warn("Bookings API returned non-success:", res.data);
          setBookings([]);
          alert(res.data?.message || "Failed to load bookings");
        }
      })
      .catch((err) => {
        console.error("Error loading bookings:", err);
        // Show a helpful error; backend error messages often useful
        const serverMessage = err.response?.data?.message || err.message || "Server error while loading bookings";
        alert("Error fetching booking details: " + serverMessage);
      })
      .finally(() => setLoadingBookings(false));
  };

  // ---------- Cancel booking (DELETE) ----------
  // The controller provides both a soft-cancel PUT /cancel-booking/{id} and a delete endpoint /delete-booking/{id}.
  // You asked that canceling should delete the booking, so we'll call DELETE /api/delete-booking/{id}
  const cancelBooking = (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This will delete it.")) return;

    axios
      .delete(`/api/delete-booking/${bookingId}`)
      .then((res) => {
        if (res.data?.status === "success") {
          alert(res.data?.message || "Booking deleted successfully");
          // refresh bookings list
          viewBookings();
        } else {
          // fallback to trying soft-cancel (PUT /cancel-booking/{id}) if backend doesn't actually delete
          console.warn("Delete returned non-success", res.data);
          // attempt soft-cancel
          axios
            .put(`/api/cancel-booking/${bookingId}`)
            .then((r2) => {
              if (r2.data?.status === "success" || r2.status === 200) {
                alert("Booking cancelled (soft) successfully");
                viewBookings();
              } else {
                alert("Failed to cancel booking: " + (r2.data?.message || JSON.stringify(r2.data)));
              }
            })
            .catch((err2) => {
              console.error("Error cancelling booking (both delete and put failed):", err2);
              alert("Error cancelling booking");
            });
        }
      })
      .catch((err) => {
        console.error("Error deleting booking:", err);
        // If delete is not allowed on server, try soft-cancel endpoint
        axios
          .put(`/api/cancel-booking/${bookingId}`)
          .then((r2) => {
            if (r2.data?.status === "success" || r2.status === 200) {
              alert("Booking cancelled successfully (soft-cancel).");
              viewBookings();
            } else {
              alert("Error cancelling booking");
            }
          })
          .catch((err2) => {
            console.error("Soft-cancel failed too:", err2);
            alert("Error cancelling booking");
          });
      });
  };

  // ---------- Make payment flow ----------
  // Behaviour:
  // 1. Save booking to sessionStorage (so /payment can read it)
  // 2. Call POST /api/hold-booking to create a "Hold" booking (your controller has this)
  // 3. On success, update UI locally to show paymentStatus = "IN PROGRESS" and status = "IN PROGRESS" and navigate to /payment
  // Note: If your backend has separate payment endpoints (create-payment, fetch-payment-by-booking), replace the hold-booking call accordingly.
  const makePayment = (booking) => {
  if (!booking) {
    alert("Booking info missing");
    return;
  }

  // Save booking to session
  sessionStorage.setItem("bookingData", JSON.stringify(booking));
  sessionStorage.setItem("bookingid", booking.bookingid);

  // If booking is already saved, skip hold-booking
  if (booking.bookingid && booking.status !== "PENDING_PAYMENT") {
    navigate("/payment");
    return;
  }

  // Build DTO for holding booking
  const dto = {
    customerEmail: booking.customerEmail,
    cylinderType: booking.cylinderType,
    deliveryLocation: booking.deliveryLocation,
    agencyid: booking.agencyid,
  };

  axios
    .post("/api/hold-booking", dto)
    .then((res) => {
      const resBooking = res.data;
      console.log("hold-booking response:", resBooking);

      setBookings((prev) =>
        prev.map((b) =>
          b.bookingid === booking.bookingid
            ? { ...b, status: "IN PROGRESS", paymentStatus: "IN PROGRESS" }
            : b
        )
      );

      navigate("/payment");
    })
    .catch((err) => {
      console.error("Error in hold-booking:", err);
      alert(
        "Unable to start payment flow: " +
          (err.response?.data?.message || err.message)
      );
    });
};


  // ---------- Submit feedback ----------
  const submitFeedback = () => {
    if (!feedbackMessage.trim()) {
      alert("Please enter your feedback");
      return;
    }
    const customerId = sessionStorage.getItem("customerId");
    if (!customerId || !profileDetails.name || !profileDetails.email) {
      alert("Unable to fetch your details. Please log in again.");
      return;
    }
    const payload = {
      customerId: Number(customerId),
      name: profileDetails.name,
      email: profileDetails.email,
      feedbackText: feedbackMessage.trim(),
    };
    axios
      .post("/api/feedback", payload)
      .then((res) => {
        if (res.data?.status === "success") {
          alert("Thank you for your feedback!");
          setFeedbackMessage("");
        } else {
          alert(res.data?.message || "Failed to submit feedback. Please try again later.");
        }
      })
      .catch((err) => {
        console.error("Feedback error:", err);
        alert("Failed to submit feedback. Please try again later.");
      });
  };

  // ---------- Photo handling ----------
  const onPhotoSelected = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedPhoto(file);
  };

  const uploadPhoto = () => {
    if (!selectedPhoto) {
      alert("Please select a photo first.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setPhotoUrl(base64);
      if (email) {
        localStorage.setItem(`photo_${email}`, base64);
        alert("Photo uploaded successfully!");
      }
    };
    reader.readAsDataURL(selectedPhoto);
  };

  const navigateTologin = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // ---------- JSX render ----------
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3 sticky-top">
        <a className="navbar-brand fw-bold text-uppercase" href="#">
          <marquee >AGCA GAS BOOKING</marquee>
        </a>
        <div className="ms-auto d-flex align-items-center">
          <div className="dropdown position-relative">
            <img
              src={photoUrl || "assets/profileicon.png"}
              alt="Profile"
              className="rounded-circle profile-icon border border-light"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ width: 44, height: 44, objectFit: "cover", cursor: "pointer" }}
            />
            {showDropdown && (
              <div className="dropdown-menu dropdown-menu-end p-3 shadow-lg show animate-dropdown" style={{ minWidth: 260 }}>
                {photoUrl && (
                  <div className="text-center mb-2">
                    <img
                      src={photoUrl}
                      alt="Uploaded"
                      className="uploaded-photo rounded-circle shadow"
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
                  </div>
                )}
                <input type="file" accept="image/*" className="form-control mb-2" onChange={onPhotoSelected} />
                <button className="btn btn-primary w-100 mb-2 fw-semibold" onClick={uploadPhoto}>
                  Upload Photo
                </button>
                <p className="mb-1"><strong>Name:</strong> {profileDetails.name}</p>
                <p className="mb-1"><strong>Email:</strong> {profileDetails.email}</p>
                <p className="mb-1"><strong>Phone:</strong> {profileDetails.phone}</p>
                <p className="mb-3"><strong>Role:</strong> {profileDetails.role}</p>
                <button className="btn btn-info w-100 mb-2 fw-semibold" onClick={() => navigate("/customer-profile")}>
                  View Profile
                </button>
                <button className="btn btn-danger w-100 fw-semibold" onClick={navigateTologin}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Dashboard home */}
      {!showAgencies && !showBookings && (
        <div className="container my-5">
          <div className="row align-items-center bg-light rounded shadow-lg p-5">
            <div className="col-md-6">
              <h1 className="fw-bold">Welcome, {customerName || profileDetails.name || "Customer"}!</h1>
              <p className="text-muted">
                Manage your gas bookings with ease. Book, track, and get support — all in one place.
              </p>
              <div>
                <button className="btn btn-primary me-2 fw-semibold" onClick={viewAgencies} disabled={loadingAgencies}>
                  {loadingAgencies ? "Loading..." : "View Agencies"}
                </button>
                <button className="btn btn-secondary fw-semibold" onClick={viewBookings} disabled={loadingBookings}>
                  {loadingBookings ? "Loading Bookings..." : "Track My Bookings"}
                </button>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2933/2933245.png"
                alt="Gas Booking"
                className="img-fluid dashboard-img"
                style={{ maxHeight: 260 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Agencies list */}
      {showAgencies && (
        <div className="container my-4">
          <button className="btn btn-outline-secondary mb-3" onClick={() => { setShowAgencies(false); setShowBookings(false); }}>
            <FaArrowLeft className="me-2" /> Back to Dashboard
          </button>
          <h3 className="fw-bold mb-4"><FaGasPump className="me-2" /> Available Gas Agencies</h3>
          {agencies.length === 0 && <div className="alert alert-info">No agencies found.</div>}
          <div className="row">
            {agencies.map((a) => (
              <div className="col-md-4 mb-4" key={a.gasid}>
                <div className="card shadow-sm agency-card h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{a.name}</h5>
                    <p><FaMapMarkerAlt className="me-2" /> <strong>Location:</strong> {a.location}</p>
                    <p><FaHome className="me-2" /> <strong>Domestic Cylinders:</strong> {a.domesticCylinders}</p>
                    <p><FaBuilding className="me-2" /> <strong>Commercial Cylinders:</strong> {a.commercialCylinders}</p>
                    <button
                      className="btn btn-success w-100 fw-semibold"
                      onClick={() => {
                        sessionStorage.setItem("selectedAgencyId", a.gasid);
                        navigate("/book-gas");
                      }}
                    >
                      Book Gas
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings */}
      {showBookings && (
        <div className="container my-4">
          <button className="btn btn-outline-secondary mb-3" onClick={() => { setShowBookings(false); setShowAgencies(false); }}>
            <FaArrowLeft className="me-2" /> Back to Dashboard
          </button>

          <h3 className="fw-bold mb-4"><FaCalendarAlt className="me-2" /> My Bookings</h3>

          {loadingBookings && (
            <div className="text-center my-4">
              <div className="spinner-border" role="status"></div>
              <div>Loading bookings...</div>
            </div>
          )}

          {!loadingBookings && bookings.length === 0 && (
            <div className="alert alert-info">No bookings found.</div>
          )}

          <div className="row">
            {bookings.map((booking) => {
              // defensive default values in case backend returns different shape
              const statusNorm = normalize(booking.status);
              const paymentNorm = normalize(booking.paymentStatus || "");

              return (
                <div className="col-md-4 mb-4" key={booking.bookingid}>
                  <div className="card shadow-sm booking-card h-100">
                    <div className="card-body">
                      <p><strong>Booking ID:</strong> {booking.bookingid}</p>
                      <p><FaGasPump className="me-2" /> <strong>Cylinder Type:</strong> {booking.cylinderType}</p>
                      <p>
                        <strong StatusBadge status={booking.status} >Status:</strong>{" "}
                        
                        <span className={`badge ${
                          statusNorm === "HOLD" ? "bg-warning" :
                          statusNorm === "IN PROGRESS" ? "bg-primary" :
                          statusNorm === "COMPLETED" ? "bg-success" :
                          statusNorm === "CANCELLED" || statusNorm === "CANCELED" ? "bg-danger" :
                          "bg-secondary"
                        }`}>
                          {booking.status}
                        </span>
                      </p>
                      <p>
                        <strong PaymentBadge status={booking.paymentStatus} >Payment Status:</strong>{" "}
                        <span className={`badge ${
                          paymentNorm === "PENDING" ? "bg-warning" :
                          paymentNorm === "IN PROGRESS" ? "bg-primary" :
                          paymentNorm === "COMPLETED" ? "bg-success" :
                          "bg-secondary"
                        }`}>
                          {booking.paymentStatus || "N/A"}
                        </span>
                      </p>
                      <p><FaTruck className="me-2" /> <strong>Delivery Status:</strong> {booking.deliveryStatus || "N/A"}</p>
                      <p><FaMapMarkerAlt className="me-2" /> <strong>Location:</strong> {booking.deliveryLocation}</p>
                      <p><FaCalendarAlt className="me-2" /> <strong>Booking Date:</strong> {booking.bookingDate}</p>
                      <p><FaRegCalendarCheck className="me-2" /><strong>Expected Delivery Date:</strong> {booking.deliveryDate}</p>

                      {/* Action buttons - ONLY show when status is "HOLD" */}
                      <div className="mt-3">
                        {statusNorm === "HOLD" && (
                          <>
                            <button
                              className="btn btn-warning w-100 mb-2 fw-semibold"
                              onClick={() => cancelBooking(booking.bookingid)}
                            >
                              Cancel Booking
                            </button>

                            <button
                              className="btn btn-primary w-100 fw-semibold"
                              onClick={() => makePayment(booking)}
                            >
                              <FaMoneyBillWave className="me-2" /> Make Payment
                            </button>
                          </>
                        )}

                        {statusNorm === "IN PROGRESS" && (
                          <div className="alert alert-info text-center mb-0">
                            <FaClock className="me-2" />
                            Your order is in progress
                          </div>
                        )}

                        {statusNorm === "COMPLETED" && (
                          <div className="alert alert-success text-center mb-0">
                            <FaCheckCircle className="me-2" />
                            Order completed successfully
                          </div>
                        )}

                        {(statusNorm === "CANCELLED" || statusNorm === "CANCELED") && (
                          <div className="alert alert-danger text-center mb-0">
                            <FaTimesCircle className="me-2" />
                            Order was cancelled
                          </div>
                        )}

                        {/* Generic fallback */}
                        {statusNorm !== "HOLD" && statusNorm !== "IN PROGRESS" && statusNorm !== "COMPLETED" && statusNorm !== "CANCELLED" && statusNorm !== "CANCELED" && (
                          <div className="alert alert-secondary text-center mb-0">
                            Status: {booking.status}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback section */}
      <div className="container my-5">
        <div className="p-4 bg-light rounded shadow-lg">
          <h2 className="fw-bold mb-3"><FaCommentDots className="me-2" />We Value Your Feedback</h2>
          <textarea
            className="form-control mb-3"
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            placeholder="Type your feedback here..."
            rows="4"
          ></textarea>
          <button
            className="btn btn-success fw-semibold"
            onClick={submitFeedback}
            disabled={!feedbackMessage.trim()}
          >
            <FaPaperPlane className="me-2" />
            Submit Feedback
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light p-4 mt-5 footer-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h3 className="fw-bold glowing-red">
  <FaFire className="me-2 fire-icon" />
  AGCA GAS BOOKINGS
</h3>
              <p className="text-muted">Your trusted partner for quick and reliable gas cylinder bookings.</p>
            </div>
            <div className="col-md-6">
              <h4 className="fw-semibold"><FaPhone className="me-2" />Contact Us</h4>
              <p><FaEnvelope className="me-2" />Email: support@agcagas.com</p>
              <p><FaPhone className="me-2" />Phone: +91-9876543210</p>
              <p><FaMapMarkerAlt className="me-2" />Address: Hyderabad, India</p>
            </div>
          </div>
          <div className="text-center mt-3 border-top pt-3">
            <p className="small">© 2025 AGCA Gas Bookings. All rights reserved. | Designed with ❤️ for customers</p>
            <a
              href="#"
              className="text-light text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <FaArrowUp className="me-1" />Back to Top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}




