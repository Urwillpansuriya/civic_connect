import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/CommentSection';

function ComplaintDetail() {
  const { id } = useParams(); // Get complaint ID from URL
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/complaints/${id}`);
        setComplaint(res.data);
      } catch (err) {
        console.error('Error loading complaint:', err);
      }
    };

    fetchComplaint();
  }, [id]);

  if (!complaint) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>{complaint.title}</h2>
      <p><strong>Category:</strong> {complaint.category}</p>
      <p><strong>Description:</strong> {complaint.description}</p>
      <p><strong>Status:</strong> {complaint.status}</p>
      <p><strong>Location:</strong> {complaint.location}</p>

      {complaint.imageUrl && (
        <img
          src={`http://localhost:5000/uploads/${complaint.imageUrl}`}
          alt="Complaint"
          style={{ width: '300px', marginTop: '10px', borderRadius: '6px' }}
        />
      )}

      {/* 🔽 Insert CommentSection */}
      <div style={{ marginTop: '30px' }}>
        <CommentSection complaintId={complaint._id} />
      </div>
    </div>
  );
}

export default ComplaintDetail;
