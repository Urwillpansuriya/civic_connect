import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, isAuthenticated } from '../utils/auth';

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints/all', {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      setComplaints(res.data);
    } catch (err) {
      alert('Failed to fetch complaints');
    }
  };

  const handleUpvote = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/complaints/${id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchData(); // Refresh complaints after upvote
    } catch (err) {
      alert('Error upvoting');
    }
  };
  

  return (
    <div>
      <h2>All Complaints</h2>
      {complaints.length === 0 && <p>No complaints found.</p>}
      {complaints.map((c) => (
        <div key={c._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h4>{c.title}</h4>
          <p><strong>Description:</strong> {c.description}</p>
          <p><strong>Location:</strong> {c.location}</p>
          <p><strong>Status:</strong> {c.status}</p>
          {c.imageUrl && (
            <img
              src={`http://localhost:5000/uploads/${c.imageUrl}`}
              alt="Complaint"
              style={{ width: '200px', marginTop: '10px' }}
            />
          )}
          <p style={{ fontStyle: 'italic' }}>
            Posted by: {c.createdBy?.name} ({c.createdBy?.email})
          </p>

          {/* 👍 Upvote Button */}
          <button onClick={() => handleUpvote(c._id)}>
            👍 {c.upvotes?.length || 0}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ComplaintList;
