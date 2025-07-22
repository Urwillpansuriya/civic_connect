import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';
import Modal from '../components/Modal'; // adjust the path as needed

function ComplaintStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState('');
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/complaints/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(res => {
      console.log('Complaint API response:', res.data);
      setComplaint(res.data);
      setStatus(res.data.status);
    });
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/complaints/status/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setStatus(newStatus);
      setModal({
        show: true,
        title: 'Success',
        message: 'Status updated!'
      });
      // Optionally, navigate back to admin dashboard:
      // navigate('/admin');
    } catch (err) {
      setModal({
        show: true,
        title: 'Error',
        message: 'Failed to update status'
      });
    }
  };

  if (!complaint) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Complaint Details</h2>
      <p><strong>Title:</strong> {complaint.title}</p>
      <p><strong>Description:</strong> {complaint.description}</p>
      <p><strong>Category:</strong> {complaint.category}</p>
      <p><strong>Status:</strong> <span style={{ fontWeight: 'bold' }}>{status}</span></p>
      <p><strong>User:</strong> {complaint.user?.name || complaint.createdBy?.name || 'Unknown'}</p>
      <p><strong>Date:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
      {complaint.imageUrl && (
        <img src={`http://localhost:5000/uploads/${complaint.imageUrl}`} alt="complaint" style={{ width: '300px', marginTop: '10px', borderRadius: '6px' }} />
      )}
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => updateStatus('pending')}
          style={{ marginRight: '10px', background: status === 'pending' ? '#ffc107' : '#eee', color: '#000', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Pending
        </button>
        <button
          onClick={() => updateStatus('in-progress')}
          style={{ marginRight: '10px', background: status === 'in-progress' ? '#17a2b8' : '#eee', color: '#000', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          In Progress
        </button>
        <button
          onClick={() => updateStatus('resolved')}
          style={{ marginRight: '10px', background: status === 'resolved' ? '#28a745' : '#eee', color: '#000', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Resolved
        </button>
        <button
          onClick={() => updateStatus('rejected')}
          style={{ background: status === 'rejected' ? '#dc3545' : '#eee', color: '#000', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Rejected
        </button>
      </div>
      <br />
      <button onClick={() => navigate('/admin')} style={{ marginTop: '20px', padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Back to Dashboard
      </button>
      <Modal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </div>
  );
}

export default ComplaintStatusPage;
