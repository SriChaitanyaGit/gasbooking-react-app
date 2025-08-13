  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "./Admin.css";

  export default function Admin() {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [showCustomers, setShowCustomers] = useState(false);
    const [adminName, setAdminName] = useState("");
    const [message, setMessage] = useState("");
    const [showBookingRequests, setShowBookingRequests] = useState(false);
    const [bookingRequests, setBookingRequests] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [showAgencies, setShowAgencies] = useState(false);
    const [showAddAgencyForm, setShowAddAgencyForm] = useState(false);
    const [newAgency, setNewAgency] = useState({
      name: "",
      location: "",
      domesticCylinders: 0,
      commercialCylinders: 0,
    });
    const [selectedAgency, setSelectedAgency] = useState(null);
    const [bookingSearchTerm, setBookingSearchTerm] = useState("");

    // New states for booking customers view
    const [showBookingCustomers, setShowBookingCustomers] = useState(false);
    const [bookingCustomers, setBookingCustomers] = useState([]);
    const [selectedBookingCustomer, setSelectedBookingCustomer] = useState(null);
    const [bookingCustomerSearchTerm, setBookingCustomerSearchTerm] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setAdminName(localStorage.getItem("adminname") || "Admin");
    }, []);

    const resetViews = () => {
      setShowCustomers(false);
      setShowAgencies(false);
      setShowAddAgencyForm(false);
      setShowBookingRequests(false);
      setShowBookingCustomers(false);
      setSelectedCustomer(null);
      setSelectedBookingCustomer(null);
    };

    // ---------- CUSTOMER FUNCTIONS ----------
    const fetchAllCustomers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/fetch-all-customers");
        const data = await res.json();
        if (data.status === "success") {
          setCustomers(data.data || []);
          resetViews();
          setShowCustomers(true);
        } else {
          console.error("Failed to fetch customers", data);
          setCustomers([]);
        }
      } catch (err) {
        console.error(err);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    const searchCustomers = async () => {
      if (searchTerm.trim()) {
        try {
          setLoading(true);
          const res = await fetch(`/api/search-customers?keyword=${encodeURIComponent(searchTerm)}`);
          const data = await res.json();
          if (data.status === "success") {
            setCustomers(data.data || []);
          } else {
            setCustomers([]);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        fetchAllCustomers();
      }
    };

    const editCustomer = (c) => {
      setSelectedCustomer({
        id: c.id,
        name: c.name || "",
        email: c.email || "",
        phone: c.phone || "",
        role: c.role || c.ROLE || "USER",
        photoUrl: c.photo_url || c.photoUrl || "",
      });
      setNewPassword("");
      setTimeout(() => {
        const el = document.getElementById("customer-editor");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    };

    const validateCustomerPayload = (payload) => {
      if (!payload.name.trim()) return "Name is required";
      if (!payload.email.trim()) return "Email is required";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(payload.email)) return "Invalid email";
      if (payload.phone && !/^\+?[0-9\- ]{7,15}$/.test(payload.phone)) return "Invalid phone number";
      return null;
    };

    const updateCustomer = async () => {
      if (!selectedCustomer) return;

      const payload = {
        id: selectedCustomer.id,
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        role: selectedCustomer.role,
        photo_url: selectedCustomer.photoUrl,
      };

      if (newPassword && newPassword.trim()) {
        payload.password = newPassword.trim();
      }

      const validationError = validateCustomerPayload(payload);
      if (validationError) {
        alert(validationError);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/update-customer/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.status === "success") {
          setMessage("✅ Customer updated successfully!");
          setSelectedCustomer(null);
          setNewPassword("");
          await fetchAllCustomers();
          setTimeout(() => setMessage(""), 3000);
        } else {
          alert(data.message || "Update failed");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while updating customer");
      } finally {
        setLoading(false);
      }
    };

    const cancelEditCustomer = () => {
      setSelectedCustomer(null);
      setNewPassword("");
    };

    const deleteCustomer = async (id) => {
      if (window.confirm("Are you sure you want to delete this customer?")) {
        try {
          setLoading(true);
          const res = await fetch(`/api/delete-customer/${id}`, { method: "DELETE" });
          const data = await res.json();
          if (data.status === "success") {
            setMessage("✅ Customer deleted successfully!");
            fetchAllCustomers();
            setTimeout(() => setMessage(""), 3000);
          } else {
            alert("Delete failed");
          }
        } catch (err) {
          console.error(err);
          alert("Delete failed");
        } finally {
          setLoading(false);
        }
      }
    };

    // ---------- NEW BOOKING CUSTOMER FUNCTIONS ----------
    const fetchBookingCustomers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/fetch-all-customers");
        const data = await res.json();
        if (data.status === "success") {
          setBookingCustomers(data.data || []);
          resetViews();
          setShowBookingCustomers(true);
        } else {
          console.error("Failed to fetch customers", data);
          setBookingCustomers([]);
        }
      } catch (err) {
        console.error(err);
        setBookingCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    const searchBookingCustomers = async () => {
      if (bookingCustomerSearchTerm.trim()) {
        try {
          setLoading(true);
          const res = await fetch(`/api/search-customers?keyword=${encodeURIComponent(bookingCustomerSearchTerm)}`);
          const data = await res.json();
          if (data.status === "success") {
            setBookingCustomers(data.data || []);
          } else {
            setBookingCustomers([]);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        fetchBookingCustomers();
      }
    };

    const viewCustomerBookings = async (customerId, customerName) => {
      try {
        setLoading(true);
        console.log('Fetching bookings for customer:', customerId, customerName);
        
        // Convert customerId to both string and number for comparison
        const customerIdStr = String(customerId);
        const customerIdNum = Number(customerId);
        
        // Try the specific customer bookings endpoint first
        let res = await fetch(`/api/admin/customer-bookings/${customerId}`);
        let data = await res.json();
        
        // If that fails, try the general booking requests with customer filter
        if (data.status !== "success" || !data.data) {
          console.log('Trying alternative endpoint with customer filter...');
          res = await fetch(`/api/admin/booking-requests?customerId=${customerId}`);
          data = await res.json();
        }
        
        // If still no success, try fetching all bookings and filter on frontend
        if (data.status !== "success" || !data.data) {
          console.log('Trying to fetch all bookings and filter on frontend...');
          res = await fetch("/api/admin/booking-requests");
          data = await res.json();
          
          if (data.status === "success" && data.data) {
            // Filter bookings for the specific customer on frontend with proper type matching
            data.data = data.data.filter(booking => {
              // Check all possible customer ID field names with both string and number comparison
              return (
                booking.customer_id === customerIdNum || booking.customer_id === customerIdStr ||
                booking.customerId === customerIdNum || booking.customerId === customerIdStr ||
                booking.userId === customerIdNum || booking.userId === customerIdStr ||
                booking.user_id === customerIdNum || booking.user_id === customerIdStr ||
                // Also check if customer name matches (fallback)
                (booking.customerName && booking.customerName.toLowerCase().includes(customerName.toLowerCase())) ||
                (booking.customer_name && booking.customer_name.toLowerCase().includes(customerName.toLowerCase()))
              );
            });
            
            console.log(`Filtered bookings for customer ${customerName}:`, data.data);
          }
        }
        
        console.log('Final API Response:', data);
        
        if (data.status === "success" && data.data) {
          // Even if we got data from API, double-check filtering to ensure only this customer's bookings
          const filteredBookings = data.data.filter(booking => {
            return (
              booking.customer_id === customerIdNum || booking.customer_id === customerIdStr ||
              booking.customerId === customerIdNum || booking.customerId === customerIdStr ||
              booking.userId === customerIdNum || booking.userId === customerIdStr ||
              booking.user_id === customerIdNum || booking.user_id === customerIdStr ||
              (booking.customerName && booking.customerName.toLowerCase().includes(customerName.toLowerCase())) ||
              (booking.customer_name && booking.customer_name.toLowerCase().includes(customerName.toLowerCase()))
            );
          });
          
          console.log('Final filtered bookings:', filteredBookings);
          
          if (filteredBookings.length > 0) {
            setBookingRequests(
              filteredBookings.map((b) => ({
                ...b,
                rejectionReason: "",
                showReject: false,
              }))
            );
            setSelectedBookingCustomer({ id: customerId, name: customerName });
            setShowBookingCustomers(false);
            setShowBookingRequests(true);
            setMessage(`📋 Found ${filteredBookings.length} booking(s) for ${customerName}`);
            setTimeout(() => setMessage(""), 3000);
          } else {
            console.log('No bookings found for customer:', customerName);
            setBookingRequests([]);
            setSelectedBookingCustomer({ id: customerId, name: customerName });
            setShowBookingCustomers(false);
            setShowBookingRequests(true);
            setMessage(`ℹ️ No bookings found for ${customerName}`);
            setTimeout(() => setMessage(""), 3000);
          }
        } else {
          // Handle API error
          setBookingRequests([]);
          setSelectedBookingCustomer({ id: customerId, name: customerName });
          setShowBookingCustomers(false);
          setShowBookingRequests(true);
          setMessage(`❌ Failed to fetch bookings for ${customerName}`);
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (err) {
        console.error('Error fetching customer bookings:', err);
        setMessage(`❌ Error fetching bookings for ${customerName}`);
        setTimeout(() => setMessage(""), 3000);
        
        // Still show the booking view but with empty results
        setBookingRequests([]);
        setSelectedBookingCustomer({ id: customerId, name: customerName });
        setShowBookingCustomers(false);
        setShowBookingRequests(true);
      } finally {
        setLoading(false);
      }
    };

    const backToBookingCustomers = () => {
      setShowBookingRequests(false);
      setSelectedBookingCustomer(null);
      setBookingRequests([]);
      setBookingSearchTerm("");
      setShowBookingCustomers(true);
    };

    // ---------- GAS AGENCY FUNCTIONS ----------
    const fetchAllAgencies = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/gas-agencies");
        const data = await res.json();
        if (data.status === "success") {
          setAgencies(data.data || []);
          resetViews();
          setShowAgencies(true);
        } else {
          setAgencies([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const editAgency = (a) => {
      setSelectedAgency({ ...a });
    };

    const updateAgency = async () => {
      if (!selectedAgency.name || !selectedAgency.location) {
        alert("Name and Location are required!");
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/update-gas-agency/${selectedAgency.gasid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedAgency),
        });
        const data = await res.json();
        if (data.status === "success") {
          setMessage("✅ Gas agency updated successfully!");
          setSelectedAgency(null);
          fetchAllAgencies();
          setTimeout(() => setMessage(""), 3000);
        } else {
          alert(data.message || "Update failed");
        }
      } catch (err) {
        console.error(err);
        alert("Update failed");
      } finally {
        setLoading(false);
      }
    };

    const deleteAgency = async (gasid) => {
      if (window.confirm("Are you sure you want to delete this gas agency?")) {
        try {
          setLoading(true);
          const res = await fetch(`/api/delete-gas-agency/${gasid}`, { method: "DELETE" });
          const data = await res.json();
          if (data.status === "success") {
            setMessage("✅ Gas agency deleted successfully!");
            fetchAllAgencies();
            setTimeout(() => setMessage(""), 3000);
          } else {
            alert(data.message || "Delete failed");
          }
        } catch (err) {
          console.error(err);
          alert("Delete failed");
        } finally {
          setLoading(false);
        }
      }
    };

    // ---------- BOOKING FUNCTIONS ----------
    const fetchBookingRequests = async () => {
      try {
        resetViews();
        setLoading(true);
        const res = await fetch("/api/admin/booking-requests");
        const data = await res.json();
        if (data.status === "success") {
          setBookingRequests(
            data.data.map((b) => ({
              ...b,
              rejectionReason: "",
              showReject: false,
            }))
          );
          setShowBookingRequests(true);
        } else {
          setBookingRequests([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const approveBooking = async (bookingId) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/approve-booking/${bookingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            bookingStatus: "APPROVED",
            deliveryStatus: "READY TO SHIP"
          })
        });

        const data = await res.json();

        if (data.status === "success") {
          setBookingRequests((prev) =>
            prev.map((b) =>
              b.bookingid === bookingId
                ? { ...b, status: "APPROVED", deliveryStatus: "READY TO SHIP" }
                : b
            )
          );
          setMessage("✅ Booking approved successfully!");
          setTimeout(() => setMessage(""), 3000);
        } else {
          alert(data.message || "Failed to approve booking");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to approve booking");
      } finally {
        setLoading(false);
      }
    };

    const rejectBooking = async (bookingId, reason) => {
      if (!reason.trim()) {
        alert("Rejection reason is required!");
        return;
      }
      try {
        setLoading(true);
        const res = await fetch("/api/admin/reject-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, reason }),
        });
        const data = await res.json();
        if (data.status === "success") {
          setBookingRequests((prev) =>
            prev.map((b) =>
              b.bookingid === bookingId ? { ...b, status: "REJECTED" } : b
            )
          );
          setMessage("❌ Booking rejected!");
          setTimeout(() => setMessage(""), 3000);
        } else {
          alert("Rejection failed!");
        }
      } catch (err) {
        console.error(err);
        alert("Rejection failed!");
      } finally {
        setLoading(false);
      }
    };

    // NEW DELIVERY STATUS UPDATE FUNCTIONS
    const updateDeliveryStatus = async (bookingId, newStatus) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/update-delivery-status/${bookingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            deliveryStatus: newStatus
          })
        });

        const data = await res.json();

        if (data.status === "success") {
          setBookingRequests((prev) =>
            prev.map((b) =>
              b.bookingid === bookingId
                ? { ...b, deliveryStatus: newStatus }
                : b
            )
          );
          
          let statusMessage = "";
          switch(newStatus) {
            case "SHIPMENT CREATED":
              statusMessage = "📦 Shipment created successfully!";
              break;
            case "SHIPPED":
              statusMessage = "🚚 Booking shipped successfully!";
              break;
            case "DELIVERED":
              statusMessage = "✅ Booking delivered successfully!";
              break;
            default:
              statusMessage = "✅ Delivery status updated!";
          }
          
          setMessage(statusMessage);
          setTimeout(() => setMessage(""), 3000);
        } else {
          alert(data.message || "Failed to update delivery status");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to update delivery status");
      } finally {
        setLoading(false);
      }
    };

    const deleteBooking = async (id) => {
      if (window.confirm("Are you sure you want to delete this booking?")) {
        try {
          setLoading(true);
          const res = await fetch(`/api/delete-booking/${id}`, { method: "DELETE" });
          const data = await res.json();
          if (data.status === "success") {
            setMessage("✅ Booking deleted successfully!");
            setBookingRequests((prev) => prev.filter((b) => b.bookingid !== id));
            setTimeout(() => setMessage(""), 3000);
          } else {
            alert("Failed to delete booking");
          }
        } catch (err) {
          console.error(err);
          alert("Failed to delete booking");
        } finally {
          setLoading(false);
        }
      }
    };

    const searchBookingRequests = async () => {
      if (!bookingSearchTerm.trim()) {
        if (selectedBookingCustomer) {
          viewCustomerBookings(selectedBookingCustomer.id, selectedBookingCustomer.name);
        } else {
          fetchBookingRequests();
        }
        return;
      }
      try {
        setLoading(true);
        let url = `/api/admin/search-bookings?keyword=${encodeURIComponent(bookingSearchTerm)}`;
        if (selectedBookingCustomer) {
          url += `&customerId=${selectedBookingCustomer.id}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "success") {
          setBookingRequests(
            data.data.map((b) => ({
              ...b,
              rejectionReason: "",
              showReject: false,
            }))
          );
        } else {
          setBookingRequests([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    
    // ---------- NAVIGATION & AGENCY FORM ----------
    const openAddAgencyForm = () => {
      resetViews();
      setShowAddAgencyForm(true);
    };

    const addcustomer =()=>
    {
      navigate("/customer-register");
    }

    const cancelAddAgency = () => {
      setShowAddAgencyForm(false);
      setNewAgency({
        name: "",
        location: "",
        domesticCylinders: 0,
        commercialCylinders: 0,
      });
    };

    const addGasAgency = async () => {
      if (!newAgency.name.trim() || !newAgency.location.trim()) {
        alert("Name and Location are required!");
        return;
      }
      try {
        setLoading(true);
        const res = await fetch("/api/admin/add-gas-agency", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAgency),
        });
        const data = await res.json();
        if (data.status === "success") {
          setMessage("✅ Gas agency added!");
          cancelAddAgency();
          fetchAllAgencies();
          setTimeout(() => setMessage(""), 3000);
        } else {
          alert(data.message || "Failed to add agency");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to add agency");
      } finally {
        setLoading(false);
      }
    };

    const logout = () => {
      localStorage.removeItem("adminid");
      localStorage.removeItem("adminname");
      navigate("/login-admin");
    };

    // ---------- HELPER FUNCTION FOR DELIVERY STATUS BADGE STYLING ----------
    const getDeliveryStatusBadgeClass = (status) => {
      switch(status) {
        case 'READY TO SHIP':
          return 'bg-success';
        case 'SHIPMENT CREATED':
          return 'bg-info';
        case 'SHIPPED':
          return 'bg-warning';
        case 'DELIVERED':
          return 'bg-primary';
        default:
          return 'bg-secondary';
      }
    };

    // ---------- Render ----------
    return (
      <div className="container-fluid py-3">
        {/* Navbar */}
        <nav className="navbar navbar-dark bg-dark mb-3 px-3">
          <span className="navbar-brand">Welcome Admin</span>
          <div>
            <button className="btn btn-outline-light me-2" onClick={fetchAllCustomers}>
              👥 Customers
            </button>
            <button className="btn btn-outline-light me-2" onClick={fetchAllAgencies}>
            🏢 Agencies
            </button>
            <button className="btn btn-outline-light me-2" onClick={fetchBookingCustomers}>
            📋 Bookings
            </button>
            <button className="btn btn-success me-2" onClick={openAddAgencyForm}>
            ➕ Add Agency
            </button>
            <button className="btn btn-success me-2" onClick={addcustomer}>
            👥 Add Customer
            </button>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </nav>

        {/* Loading indicator */}
        {loading && (
          <div className="alert alert-info text-center">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading...
          </div>
        )}

        {/* Success/Info Message */}
        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : message.includes('❌') ? 'alert-danger' : 'alert-info'} text-center`}>
            {message}
          </div>
        )}

        {/* Customers Table */}
        {showCustomers && (
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">👥 Customers Management</h4>
              <span className="badge bg-primary">{customers.length} customers</span>
            </div>
            
            <div className="input-group mb-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search customers by name, email, or phone..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchCustomers()}
              />
              <button className="btn btn-primary" onClick={searchCustomers}>
                🔍 Search
              </button>
              {searchTerm && (
                <button className="btn btn-outline-secondary" onClick={() => {
                  setSearchTerm("");
                  fetchAllCustomers();
                }}>
                  Clear
                </button>
              )}
            </div>

            <div className="table-responsive" style={{ maxHeight: 420, overflowY: "auto" }}>
              <table className="table table-bordered table-hover mb-0">
                <thead className="table-secondary" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr>
                    <th style={{ minWidth: 200 }}>Name</th>
                    <th style={{ minWidth: 220 }}>Email</th>
                    <th style={{ minWidth: 130 }}>Phone</th>
                    <th style={{ minWidth: 100 }}>Role</th>
                    <th style={{ minWidth: 170 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        {searchTerm ? "No customers found matching your search" : "No customers found"}
                      </td>
                    </tr>
                  )}
                  {customers.map((c) => (
                    <tr key={c.id} className={selectedCustomer && selectedCustomer.id === c.id ? "table-warning" : ""}>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td>{c.phone || "-"}</td>
                      <td>
                        <span className={`badge ${(c.role || c.ROLE || "USER").toUpperCase() === 'ADMIN' ? 'bg-danger' : 'bg-success'}`}>
                          {(c.role || c.ROLE || "USER").toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => editCustomer(c)}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteCustomer(c.id)}>
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inline editor appears when selectedCustomer is set */}
            {selectedCustomer && (
              <div id="customer-editor" className="card mt-3 p-3 border-primary">
                <h5 className="text-primary">✏️ Edit Customer</h5>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Name *</label>
                    <input 
                      value={selectedCustomer.name} 
                      onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })} 
                      className="form-control mb-2" 
                      required
                    />

                    <label className="form-label">Email *</label>
                    <input 
                      type="email"
                      value={selectedCustomer.email} 
                      onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })} 
                      className="form-control mb-2" 
                      required
                    />

                    <label className="form-label">Phone</label>
                    <input 
                      value={selectedCustomer.phone} 
                      onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })} 
                      className="form-control mb-2" 
                      placeholder="Optional"
                    />

                    <label className="form-label">Role</label>
                    <select 
                      value={selectedCustomer.role} 
                      onChange={(e) => setSelectedCustomer({ ...selectedCustomer, role: e.target.value })} 
                      className="form-select mb-2"
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="USER">USER</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">New Password (optional)</label>
                    <input 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className="form-control mb-2" 
                      type="password" 
                      placeholder="Leave empty to keep existing password" 
                    />

                    <div className="mb-2">
                      <div className="d-flex align-items-center">
                        <small className="text-muted">
                          * Required fields
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <button className="btn btn-primary me-2" onClick={updateCustomer}>
                    💾 Update Customer
                  </button>
                  <button className="btn btn-secondary" onClick={cancelEditCustomer}>
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Booking Customers Table */}
        {showBookingCustomers && (
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">👥 Select Customer to View Bookings</h4>
              <span className="badge bg-info">{bookingCustomers.length} customers</span>
            </div>
            
            <div className="input-group mb-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search customers to view their bookings..." 
                value={bookingCustomerSearchTerm} 
                onChange={(e) => setBookingCustomerSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchBookingCustomers()}
              />
              <button className="btn btn-primary" onClick={searchBookingCustomers}>
                🔍 Search
              </button>
              {bookingCustomerSearchTerm && (
                <button className="btn btn-outline-secondary" onClick={() => {
                  setBookingCustomerSearchTerm("");
                  fetchBookingCustomers();
                }}>
                  Clear
                </button>
              )}
            </div>

            <div className="table-responsive" style={{ maxHeight: 420, overflowY: "auto" }}>
              <table className="table table-bordered table-hover mb-0">
                <thead className="table-secondary" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr>
                    <th style={{ minWidth: 200 }}>Name</th>
                    <th style={{ minWidth: 220 }}>Email</th>
                    <th style={{ minWidth: 130 }}>Phone</th>
                    <th style={{ minWidth: 170 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingCustomers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        {bookingCustomerSearchTerm ? "No customers found matching your search" : "No customers found"}
                      </td>
                    </tr>
                  )}
                  {bookingCustomers.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td>{c.phone || "-"}</td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm" 
                          onClick={() => viewCustomerBookings(c.id, c.name)}
                        >
                          📋 View Bookings
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Agencies Table */}
        {showAgencies && (
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">🏢 Gas Agencies Management</h4>
              <span className="badge bg-primary">{agencies.length} agencies</span>
            </div>
            
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-secondary">
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Domestic Cylinders</th>
                    <th>Commercial Cylinders</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agencies.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        No agencies found
                      </td>
                    </tr>
                  )}
                  {agencies.map((a) => (
                    <tr key={a.gasid} className={selectedAgency && selectedAgency.gasid === a.gasid ? "table-warning" : ""}>
                      <td>{a.name}</td>
                      <td>{a.location}</td>
                      <td>
                        <span className="badge bg-success">{a.domesticCylinders}</span>
                      </td>
                      <td>
                        <span className="badge bg-info">{a.commercialCylinders}</span>
                      </td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => editAgency(a)}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteAgency(a.gasid)}>
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedAgency && (
              <div className="card mt-3 p-3 border-primary">
                <h5 className="text-primary">✏️ Edit Agency</h5>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Name *</label>
                    <input 
                      value={selectedAgency.name} 
                      onChange={(e) => setSelectedAgency({ ...selectedAgency, name: e.target.value })} 
                      className="form-control mb-2" 
                      required
                    />
                    <label className="form-label">Location *</label>
                    <input 
                      value={selectedAgency.location} 
                      onChange={(e) => setSelectedAgency({ ...selectedAgency, location: e.target.value })} 
                      className="form-control mb-2" 
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Domestic Cylinders</label>
                    <input 
                      type="number" 
                      min="0"
                      value={selectedAgency.domesticCylinders} 
                      onChange={(e) => setSelectedAgency({ ...selectedAgency, domesticCylinders: Number(e.target.value) })} 
                      className="form-control mb-2" 
                    />
                    <label className="form-label">Commercial Cylinders</label>
                    <input 
                      type="number" 
                      min="0"
                      value={selectedAgency.commercialCylinders} 
                      onChange={(e) => setSelectedAgency({ ...selectedAgency, commercialCylinders: Number(e.target.value) })} 
                      className="form-control mb-2" 
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <button className="btn btn-primary me-2" onClick={updateAgency}>
                    💾 Update Agency
                  </button>
                  <button className="btn btn-secondary" onClick={() => setSelectedAgency(null)}>
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Booking Requests Table */}
        {showBookingRequests && (
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                📋 Booking Requests 
                {selectedBookingCustomer && (
                  <span className="text-muted"> - {selectedBookingCustomer.name}</span>
                )}
              </h4>
              <div>
                <span className="badge bg-primary me-2">{bookingRequests.length} bookings</span>
                {selectedBookingCustomer && (
                  <button className="btn btn-secondary btn-sm" onClick={backToBookingCustomers}>
                    ← Back to Customers
                  </button>
                )}
              </div>
            </div>
            
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search bookings by ID, customer name, or status..."
                value={bookingSearchTerm}
                onChange={(e) => setBookingSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchBookingRequests()}
              />
              <button className="btn btn-primary" onClick={searchBookingRequests}>
                🔍 Search
              </button>
              {bookingSearchTerm && (
                <button className="btn btn-outline-secondary" onClick={() => {
                  setBookingSearchTerm("");
                  searchBookingRequests();
                }}>
                  Clear
                </button>
              )}
            </div>
            
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-secondary">
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Cylinder Type</th>
                    <th>Status</th>
                    <th>Delivery Status</th>
                    <th style={{ minWidth: 300 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        {selectedBookingCustomer 
                          ? `No bookings found for ${selectedBookingCustomer.name}` 
                          : bookingSearchTerm 
                          ? "No bookings found matching your search"
                          : "No bookings found"
                        }
                      </td>
                    </tr>
                  )}
                  {bookingRequests.map((b) => (
                    <tr key={b.bookingid}>
                      <td>
                        <strong>#{b.bookingid}</strong>
                      </td>
                      <td>{b.customerName || b.customer_name || 'N/A'}</td>
                      <td>
                        <span className={`badge ${b.cylinderType === 'Domestic' ? 'bg-success' : 'bg-info'}`}>
                          {b.cylinderType || b.cylinder_type || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          b.status === 'APPROVED' ? 'bg-success' : 
                          b.status === 'REJECTED' ? 'bg-danger' : 
                          'bg-warning text-dark'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getDeliveryStatusBadgeClass(b.deliveryStatus)}`}>
                          {b.deliveryStatus || 'N/A'}
                        </span>
                      </td>
                      <td>
                        {/* Show Approve/Reject buttons for pending bookings */}
                        {(b.status === "In Progress" || b.status === "HOLD") && (
                          <>
                            <button 
                              className="btn btn-success btn-sm me-1 mb-1" 
                              onClick={() => approveBooking(b.bookingid)}
                              title="Approve booking"
                            >
                              ✅ Approve
                            </button>
                            <button 
                              className="btn btn-danger btn-sm me-1 mb-1" 
                              onClick={() => {
                                const reason = prompt("Enter rejection reason:");
                                if (reason !== null && reason.trim()) {
                                  rejectBooking(b.bookingid, reason);
                                }
                              }}
                              title="Reject booking"
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}

                        {/* Show delivery status update buttons when status is READY TO SHIP */}
                        {b.deliveryStatus === "READY TO SHIP" && (
                          <>
                            <button 
                              className="btn btn-info btn-sm me-1 mb-1" 
                              onClick={() => updateDeliveryStatus(b.bookingid, "SHIPMENT CREATED")}
                              title="Create shipment"
                            >
                              📦 Shipment Created
                            </button>
                            <button 
                              className="btn btn-warning btn-sm me-1 mb-1" 
                              onClick={() => updateDeliveryStatus(b.bookingid, "SHIPPED")}
                              title="Mark as shipped"
                            >
                              🚚 Shipped
                            </button>
                            <button 
                              className="btn btn-primary btn-sm me-1 mb-1" 
                              onClick={() => updateDeliveryStatus(b.bookingid, "DELIVERED")}
                              title="Mark as delivered"
                            >
                              ✅ Delivered
                            </button>
                          </>
                        )}

                        {/* Show delivery status update buttons when status is SHIPMENT CREATED */}
                        {b.deliveryStatus === "SHIPMENT CREATED" && (
    <>
      <button 
        className="btn btn-warning btn-sm me-1 mb-1" 
        onClick={() => updateDeliveryStatus(b.bookingid, "SHIPPED")}
        title="Mark as shipped"
      >
        🚚 Shipped
      </button>
      <button 
        className="btn btn-primary btn-sm me-1 mb-1" 
        onClick={() => updateDeliveryStatus(b.bookingid, "DELIVERED")}
        title="Mark as delivered"
      >
        ✅ Delivered
      </button>
    </>
  )}

                        {/* Show delivery status update buttons when status is SHIPPED */}
                        {b.deliveryStatus === "SHIPPED" && (
                          <button 
                            className="btn btn-primary btn-sm me-1 mb-1" 
                            onClick={() => updateDeliveryStatus(b.bookingid, "DELIVERED")}
                            title="Mark as delivered"
                          >
                            ✅ Delivered
                          </button>
                        )}

                        {/* Delete button - always visible */}
                        <button 
                          className="btn btn-outline-danger btn-sm mb-1" 
                          onClick={() => deleteBooking(b.bookingid)}
                          title="Delete booking"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Agency Form */}
        {showAddAgencyForm && (
          <div className="card p-3">
            <h4 className="text-success mb-3">➕ Add New Gas Agency</h4>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Agency Name *</label>
                <input 
                  type="text" 
                  className="form-control mb-3" 
                  placeholder="Enter agency name" 
                  value={newAgency.name} 
                  onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })} 
                  required
                />
                <label className="form-label">Location *</label>
                <input 
                  type="text" 
                  className="form-control mb-3" 
                  placeholder="Enter location" 
                  value={newAgency.location} 
                  onChange={(e) => setNewAgency({ ...newAgency, location: e.target.value })} 
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Domestic Cylinders</label>
                <input 
                  type="number" 
                  className="form-control mb-3" 
                  placeholder="Enter number of domestic cylinders" 
                  min="0"
                  value={newAgency.domesticCylinders} 
                  onChange={(e) => setNewAgency({ ...newAgency, domesticCylinders: Number(e.target.value) })} 
                />
                <label className="form-label">Commercial Cylinders</label>
                <input 
                  type="number" 
                  className="form-control mb-3" 
                  placeholder="Enter number of commercial cylinders" 
                  min="0"
                  value={newAgency.commercialCylinders} 
                  onChange={(e) => setNewAgency({ ...newAgency, commercialCylinders: Number(e.target.value) })} 
                />
              </div>
            </div>
            <div className="mt-3">
              <button className="btn btn-success me-2" onClick={addGasAgency}>
                💾 Add Agency
              </button>
              <button className="btn btn-secondary" onClick={cancelAddAgency}>
                ❌ Cancel
              </button>
            </div>
            <small className="text-muted mt-2 d-block">* Required fields</small>
          </div>
        )}
      </div>
    );
  }