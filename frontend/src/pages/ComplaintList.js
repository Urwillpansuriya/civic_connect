import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, isAuthenticated } from '../utils/auth';

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchData(currentPage);
  }, [navigate, currentPage]);

  const fetchData = async (page) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/complaints/all?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      setComplaints(res.data.complaints);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setModal({
        show: true,
        title: 'Error',
        message: 'Failed to fetch complaints'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/complaints/${id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchData(currentPage); // Refresh complaints on current page after upvote
    } catch (err) {
      setModal({
        show: true,
        title: 'Error',
        message: 'Error upvoting'
      });
    }
  };
  

  return (
    <div>
      <h2>All Complaints</h2>
      {loading ? (
        <p>Loading complaints...</p>
      ) : (
        <>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  margin: '0 5px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
                  color: 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>

              <span style={{ margin: '0 10px' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  margin: '0 5px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
                  color: 'white',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      {modal.show && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            textAlign: 'center'
          }}>
            <h3>{modal.title}</h3>
            <p>{modal.message}</p>
            <button onClick={() => setModal({ ...modal, show: false })} style={{
              marginTop: '10px',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '5px',
              background: '#007bff',
              color: '#fff',
              cursor: 'pointer'
            }}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintList;
