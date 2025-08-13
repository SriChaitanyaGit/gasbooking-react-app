import React, { useState, useEffect } from "react";
import axios from "axios";

const GasAgency = () => {
  const [agencies, setAgencies] = useState([]);
  const [newAgency, setNewAgency] = useState({
    name: "",
    location: "",
    domesticCylinders: 0,
    commercialCylinders: 0,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [message, setMessage] = useState("");
  const [showAgencies, setShowAgencies] = useState(false); 

  // Fetch all agencies
  const fetchAllAgencies = async () => {
    try {
      const response = await axios.get("/api/admin/all-gas-agencies");
      if (response.data.status === "success") {
        setAgencies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching gas agencies:", error);
    }
  };

  // Add new gas agency
  const addGasAgency = async () => {
    if (!newAgency.name || !newAgency.location) {
      alert("Name and Location are required!");
      return;
    }

    try {
      const response = await axios.post(
        "/api/admin/add-gas-agency",
        newAgency
      );
      if (response.data.status === "success") {
        setMessage("✅ Gas agency added!");
        fetchAllAgencies();
        setShowAddForm(false);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      alert("Failed to add gas agency");
    }
  };

  // Update existing gas agency
  const updateGasAgency = async () => {
    if (!selectedAgency.name || !selectedAgency.location) {
      alert("Name and Location are required!");
      return;
    }

    try {
      // Sending data as query parameters since backend expects @RequestParam
      const response = await axios.put(
        `/api/admin/update-gas-agency/${selectedAgency.gasid}`,
        null, // We don't send a request body in this case
        { params: { 
            name: selectedAgency.name, 
            location: selectedAgency.location 
          } 
        }
      );

      if (response.data.status === "success") {
        setMessage("✅ Gas agency updated!");
        fetchAllAgencies();
        setShowEditForm(false);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating gas agency:", error);
      alert("Failed to update gas agency");
    }
  };

  // Delete gas agency
  const deleteGasAgency = async (gasid) => {
    if (window.confirm("Are you sure you want to delete this gas agency?")) {
      try {
        const response = await axios.delete(
          `/api/admin/delete-gas-agency/${gasid}`
        );
        if (response.data.status === "success") {
          setMessage("✅ Gas agency deleted!");
          fetchAllAgencies();
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (error) {
        alert("Failed to delete gas agency");
      }
    }
  };

  // Handle "View All" button click
  const handleViewAllClick = () => {
    setShowAgencies(true);
    fetchAllAgencies();
  };

  return (
    <div className="container mt-4">
      {/* Success Message */}
      {message && <div className="alert alert-success">{message}</div>}

      {/* Admin Dashboard Cards */}
      <div className="row">
        <div className="col-md-4">
          <div className="card" onClick={handleViewAllClick}>
            <div className="card-body text-center">
              <h5 className="card-title">View All Gas Agencies</h5>
              <p className="card-text">Browse all gas agencies currently listed</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card" onClick={() => setShowAddForm(true)}>
            <div className="card-body text-center">
              <h5 className="card-title">Add Gas Agency</h5>
              <p className="card-text">Register a new gas agency with its details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Gas Agency Form */}
      {showAddForm && (
        <div className="card mt-4">
          <div className="card-body">
            <h3 className="card-title">Add New Gas Agency</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={newAgency.name}
                onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                value={newAgency.location}
                onChange={(e) => setNewAgency({ ...newAgency, location: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Domestic Cylinders</label>
              <input
                type="number"
                className="form-control"
                value={newAgency.domesticCylinders}
                onChange={(e) => setNewAgency({ ...newAgency, domesticCylinders: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Commercial Cylinders</label>
              <input
                type="number"
                className="form-control"
                value={newAgency.commercialCylinders}
                onChange={(e) => setNewAgency({ ...newAgency, commercialCylinders: e.target.value })}
              />
            </div>
            <button className="btn btn-success mt-3" onClick={addGasAgency}>
              Add Agency
            </button>
            <button className="btn btn-danger mt-3 ml-2" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Gas Agency Form */}
      {showEditForm && selectedAgency && (
        <div className="card mt-4">
          <div className="card-body">
            <h3 className="card-title">Edit Gas Agency</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={selectedAgency.name}
                onChange={(e) => setSelectedAgency({ ...selectedAgency, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                value={selectedAgency.location}
                onChange={(e) => setSelectedAgency({ ...selectedAgency, location: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Domestic Cylinders</label>
              <input
                type="number"
                className="form-control"
                value={selectedAgency.domesticCylinders}
                onChange={(e) => setSelectedAgency({ ...selectedAgency, domesticCylinders: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Commercial Cylinders</label>
              <input
                type="number"
                className="form-control"
                value={selectedAgency.commercialCylinders}
                onChange={(e) => setSelectedAgency({ ...selectedAgency, commercialCylinders: e.target.value })}
              />
            </div>
            <button className="btn btn-success mt-3" onClick={updateGasAgency}>
              Update Agency
            </button>
            <button className="btn btn-danger mt-3 ml-2" onClick={() => setShowEditForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Gas Agencies Section - Only show after clicking "View All" */}
      {showAgencies && (
        <div className="row mt-4">
          {agencies.map((agency) => (
            <div className="col-md-4" key={agency.gasid}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{agency.name}</h5>
                  <p><strong>Location:</strong> {agency.location}</p>
                  <p><strong>Domestic Cylinders:</strong> {agency.domesticCylinders}</p>
                  <p><strong>Commercial Cylinders:</strong> {agency.commercialCylinders}</p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-warning btn-sm" onClick={() => { setSelectedAgency(agency); setShowEditForm(true); }}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteGasAgency(agency.gasid)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GasAgency;
