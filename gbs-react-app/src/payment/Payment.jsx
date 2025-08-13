import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [upiId] = useState("9347107831@ybl");
  const [agencyName, setAgencyName] = useState("GasAgency");
  const [amount, setAmount] = useState(0);
  const [cylinderType, setCylinderType] = useState("");

  useEffect(() => {
    const booking = sessionStorage.getItem("bookingData");
    const payment = sessionStorage.getItem("paymentData");

    if (!booking || !payment) {
      alert("No booking found!");
      navigate("/customer-dashboard");
      return;
    }

    const parsedBooking = JSON.parse(booking);
    const parsedPayment = JSON.parse(payment);

    setBookingData(parsedBooking);
    setPaymentData(parsedPayment);
    setAmount(parsedPayment.amount);
    setCylinderType(parsedBooking.cylinderType);

    const agencyId = parsedBooking.agencyid || parsedBooking.gasAgency?.agencyid;
    if (!agencyId || agencyId <= 0) {
      alert("Agency information missing!");
      navigate("/customer-dashboard");
      return;
    }

    setQrCodeUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=${agencyName}&am=${parsedPayment.amount}`
    );

    axios
      .get(`/api/admin/gas-agency/${agencyId}`)
      .then((res) => {
        if (res.data.status === "success") {
          setAgencyName(res.data.data.name);
          setQrCodeUrl(
            `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=${encodeURIComponent(res.data.data.name)}&am=${parsedPayment.amount}`
          );
        }
      })
      .catch((err) => console.error("Error fetching agency:", err));
  }, [navigate, upiId]);

  const goBack = () => {
    navigate("/customer-dashboard");
  };

  const completePayment = () => {
    const bookingid = bookingData?.bookingid || sessionStorage.getItem("bookingid");

    if (!bookingid) {
      alert("Booking ID missing.");
      return;
    }

    axios
      .post(`/api/update-payment-status/${bookingid}`, {
        paymentStatus: "PAYMENT RECEIVED",
        bookingStatus: "In Progress"
      })
      .then((res) => {
        if (res.data.status === "success") {
          alert("Payment received. Awaiting approval.");
          sessionStorage.removeItem("bookingid");
          sessionStorage.removeItem("bookingData");
          sessionStorage.removeItem("paymentData");
          navigate("/customer-dashboard");
        } else {
          alert("Status update failed: " + (res.data.message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Payment status update error:", err);
        alert(err.response?.data?.message || "Server error during payment update");
      });
  };

  return (
    <div className="pm-page">
      <div className="pm-header">
        <button className="pm-back-btn" onClick={goBack}>⬅ Back</button>
      </div>

      <div className="pm-container">
        <h2 className="pm-title">Complete Your Payment</h2>
        <p className="pm-subtitle">Scan the QR code to pay ₹{amount} for your {cylinderType} cylinder.</p>

        <div className="pm-summary">
          <p><strong>Agency:</strong> {agencyName}</p>
          <p><strong>Cylinder Type:</strong> {cylinderType}</p>
          <p><strong>Amount:</strong> ₹{amount}</p>
        </div>

        <div className="pm-qr-section">
          <p>Scan the QR code below to pay:</p>
          {qrCodeUrl && <img src={qrCodeUrl} alt="UPI QR Code" className="pm-qr-code" />}
          <p><strong>UPI ID:</strong> {upiId}</p>
        </div>

        <div className="pm-confirm">
          <button className="pm-btn pm-btn--primary" onClick={completePayment}>
            I have completed the payment
          </button>
        </div>
      </div>
    </div>
  );
}
