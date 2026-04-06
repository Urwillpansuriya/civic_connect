import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getToken } from '../utils/auth';
import getImageSrc from '../utils/image';
const API_URL = process.env.REACT_APP_API_URL || "https://civic-connect-hams.onrender.com";
function ComplaintDetailPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/complaints/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(res => setComplaint(res.data));
  }, [id]);

  if (!complaint) return <p>Loading...</p>;

  return (
    <div style={{ padding: '30px' }}>
      <h2>{complaint.title}</h2>
      <p><strong>Description:</strong> {complaint.description}</p>
      <p><strong>Category:</strong> {complaint.category}</p>
      <p><strong>Status:</strong> {complaint.status}</p>
      <p><strong>Location:</strong> {complaint.location}</p>
      <p><strong>Date:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
      {complaint.image && (
        <img
          src={getImageSrc(complaint.image)}
          alt="Complaint"
          style={{ width: '300px', marginTop: '20px' }}
        />
      )}
    </div>
  );
}

export default ComplaintDetailPage;
