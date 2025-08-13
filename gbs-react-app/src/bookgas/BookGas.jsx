import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BookGas.css";
import { useNavigate } from "react-router-dom";

export default function BookGas() {
  const [cylinderType, setCylinderType] = useState("");
  const [price, setPrice] = useState(0);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [bookings, setBookings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem("email") || "";
    const storedAgencyId = sessionStorage.getItem("selectedAgencyId");

    if (!email) {
      alert("Please log in first!");
      navigate("/login");
      return;
    }
    if (!storedAgencyId) {
      alert("Please select an agency before booking!");
      navigate("/customer-dashboard");
      return;
    }

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 5);
    setDeliveryDate(currentDate.toISOString().split("T")[0]);
  }, [navigate]);

  const updatePrice = (event) => {
    const selectedType = event.target.value;
    setCylinderType(selectedType);

    if (selectedType === "Domestic") {
      setPrice(900);
    } else if (selectedType === "Commercial") {
      setPrice(1850);
    } else {
      setPrice(0);
    }
  };

  const bookGas = async (event) => {
    event.preventDefault();

    const email = sessionStorage.getItem("email") || "";
    const agencyId = Number(sessionStorage.getItem("selectedAgencyId")) || null;

    if (!cylinderType) {
      alert("Please select cylinder type!");
      return;
    }
    if (!deliveryLocation.trim()) {
      alert("Please enter delivery location!");
      return;
    }
    if (!agencyId) {
      alert("Agency ID missing. Please select an agency again.");
      navigate("/customer-dashboard");
      return;
    }

    const bookingData = {
      email,
      cylinderType,
      deliveryLocation,
      agencyId,
      bookingStatus: "In Progress",
      paymentStatus: "Pending"
    };

    try {
      const res = await axios.post("/api/book-gas", bookingData);

      if (res.data.status === "success" && res.data.data) {
        const booking = res.data.data;
        const bookingid = booking.bookingid;

        const safePaymentId = Math.floor(Math.random() * 1000000000);
        const paymentPayload = {
          paymentid: safePaymentId,
          bookingid,
          amount: price,
          paymentStatus: "Pending",
          paymentMode: "Online"
        };

        await axios.post("/api/create-payment", paymentPayload);

        sessionStorage.setItem("bookingid", bookingid);
        sessionStorage.setItem("bookingData", JSON.stringify({ ...booking, bookingStatus: "In Progress", paymentStatus: "Pending" }));
        sessionStorage.setItem("paymentData", JSON.stringify(paymentPayload));

        setBookings(prev => [...prev, {
          bookingid,
          cylinderType,
          price,
          deliveryLocation,
          deliveryDate,
          bookingStatus: "In Progress",
          paymentStatus: "Pending"
        }]);

        alert("Booking placed successfully. Proceeding to payment...");
        navigate("/payment");
      } else {
        alert(res.data.message || "Booking failed");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || "Server error while booking");
    }
  };

  return (
    <div className="bg-container container mt-5">
      <div className="bg-card card shadow p-4">
        <h2 className="bg-title text-center mb-4 text-primary">Book Gas Cylinder</h2>

        <form onSubmit={bookGas}>
          <div className="row">
            <div className="bg-group col-md-6 mb-3">
              <label htmlFor="cylinderType" className="form-label">Cylinder Type</label>
              <select
                id="cylinderType"
                className="bg-input form-select"
                value={cylinderType}
                onChange={updatePrice}
                required
              >
                <option value="">-- Select --</option>
                <option value="Domestic">Domestic</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {price > 0 && (
              <>
                <div className="bg-group col-md-6 mb-3">
                  <label htmlFor="price" className="form-label">Price (in ₹)</label>
                  <input
                    type="text"
                    className="bg-input form-control"
                    id="price"
                    value={price}
                    readOnly
                  />
                </div>

                <div className="bg-group col-md-6 mb-3">
                  <label htmlFor="deliveryLocation" className="form-label">Delivery Location</label>
                  <input
                    type="text"
                    className="bg-input form-control"
                    id="deliveryLocation"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="bg-group col-md-6 mb-3">
                  <label htmlFor="deliveryDate" className="form-label">Expected Delivery Date</label>
                  <input
                    type="text"
                    className="bg-input form-control"
                    id="deliveryDate"
                    value={deliveryDate}
                    readOnly
                  />
                </div>
              </>
            )}
          </div>

          <div className="d-grid">
            <button type="submit" className="bg-btn btn btn-primary">Book Now</button>
          </div>
        </form>
      </div>

      {bookings.length > 0 && (
        <div className="bg-records card shadow p-4 mt-4">
          <h4 className="bg-subtitle text-primary mb-3">Booking Records</h4>
          <table className="bg-table table table-bordered table-striped">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Cylinder Type</th>
                <th>Price (₹)</th>
                <th>Location</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingid}>
                  <td>{b.bookingid}</td>
                  <td>{b.cylinderType}</td>
                  <td>{b.price}</td>
                  <td>{b.deliveryLocation}</td>
                  <td>{b.deliveryDate}</td>
                  <td>{b.bookingStatus}</td>
                  <td>{b.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
