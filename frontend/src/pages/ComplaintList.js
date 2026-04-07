import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, isAuthenticated } from '../utils/auth';
import getImageSrc from '../utils/image';
import Layout from '../components/Layout';
import '../components/Layout.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

function getStatusClass(status) {
  const s = (status || '').toLowerCase().replace(' ', '-');
  if (s === 'pending') return 'pill pill--pending';
  if (s === 'in-progress' || s === 'inprogress') return 'pill pill--in-progress';
  if (s === 'resolved') return 'pill pill--resolved';
  if (s === 'rejected') return 'pill pill--rejected';
  return 'pill pill--default';
}

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: '', message: '' });

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
      const res = await axios.get(
        `${API_URL}/api/complaints/all?page=${page}&limit=12`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setComplaints(res.data.complaints);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setModal({ show: true, title: 'Error', message: 'Failed to fetch complaints' });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Layout>
      <div className="welcome-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>📋 All Complaints</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
          Browse all civic complaints registered in the system
        </p>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
          <p>Loading complaints…</p>
        </div>
      ) : (
        <>
          {complaints.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              No complaints found.
            </div>
          )}
          <div className="complaint-grid">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="complaint-card"
                onClick={() => navigate(`/complaints/${c._id}`)}
              >
                {c.imageUrl && (
                  <img
                    src={getImageSrc(c.imageUrl)}
                    alt="Complaint"
                    className="complaint-card__image"
                  />
                )}
                <p className="complaint-card__title">{c.title}</p>
                <p className="complaint-card__meta">
                  📍 {c.placeName || c.location || 'Unknown'}
                </p>
                <p className="complaint-card__desc">{c.description}</p>
                <div className="complaint-card__footer">
                  <span className={getStatusClass(c.status)}>{c.status}</span>
                  <span className="complaint-card__meta">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: '28px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: currentPage === 1 ? '#e5e7eb' : '#6d28d9',
                  color: currentPage === 1 ? '#9ca3af' : '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                }}
              >
                ← Prev
              </button>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: currentPage === totalPages ? '#e5e7eb' : '#6d28d9',
                  color: currentPage === totalPages ? '#9ca3af' : '#fff',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {modal.show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '300px', textAlign: 'center' }}>
            <h3>{modal.title}</h3>
            <p>{modal.message}</p>
            <button onClick={() => setModal({ ...modal, show: false })} style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', background: '#6d28d9', color: '#fff', cursor: 'pointer' }}>OK</button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ComplaintList;
