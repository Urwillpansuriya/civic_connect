import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';
import CommentSection from '../components/CommentSection';
import getImageSrc from '../utils/image';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

const STATUS_OPTIONS = [
  { value: 'pending',     label: 'Pending',     bg: '#fef3c7', color: '#92400e', active: '#f59e0b' },
  { value: 'in-progress', label: 'In Progress',  bg: '#dbeafe', color: '#1e40af', active: '#3b82f6' },
  { value: 'resolved',    label: 'Resolved',     bg: '#d1fae5', color: '#065f46', active: '#10b981' },
  { value: 'rejected',    label: 'Rejected',     bg: '#fee2e2', color: '#991b1b', active: '#ef4444' }
];

function ComplaintStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', message: '' });

  useEffect(() => {
    axios.get(`${API_URL}/api/complaints/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(res => {
      setComplaint(res.data);
      setStatus(res.data.status);
    }).catch(err => {
      console.error('Failed to load complaint:', err);
      setModal({ show: true, title: 'Error', message: 'Failed to load complaint details.' });
    });
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await axios.patch(
        `${API_URL}/api/complaints/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setStatus(newStatus);
      setComplaint(prev => prev ? { ...prev, status: newStatus } : prev);
      setModal({ show: true, title: 'Success', message: `Status updated to "${newStatus}" successfully!` });
    } catch (err) {
      console.error('Status update error:', err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to update status.';
      setModal({ show: true, title: 'Error', message: errMsg });
    } finally {
      setUpdating(false);
    }
  };

  if (!complaint) {
    return (
      <div style={s.page}>
        <div style={s.loadingWrap}>
          <div style={s.spinner} />
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '12px' }}>Loading complaint…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <button onClick={() => navigate('/admin')} style={s.backBtn}>← Back to Dashboard</button>

      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerIcon}>📋</div>
          <div>
            <h2 style={s.headerTitle}>Complaint Details</h2>
            <p style={s.headerSub}>Review and update complaint status</p>
          </div>
        </div>

        {/* Complaint Info Card */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>{complaint.title}</h3>

          {complaint.imageUrl && (
            <img
              src={getImageSrc(complaint.imageUrl)}
              alt="complaint"
              style={s.image}
            />
          )}

          <div style={s.metaGrid}>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Category</span>
              <span style={s.metaValue}>{complaint.category || '—'}</span>
            </div>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Current Status</span>
              <span style={{
                ...s.metaValue,
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: '600',
                ...getStatusStyle(status)
              }}>{status}</span>
            </div>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Submitted By</span>
              <span style={s.metaValue}>{complaint.user?.name || complaint.createdBy?.name || 'Unknown'}</span>
            </div>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Date</span>
              <span style={s.metaValue}>{new Date(complaint.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Location</span>
              <span style={s.metaValue}>
                {[complaint.placeName, complaint.areaName, complaint.cityName].filter(Boolean).join(', ') || complaint.location || '—'}
              </span>
            </div>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Likes</span>
              <span style={s.metaValue}>👍 {complaint.likes ? complaint.likes.length : 0}</span>
            </div>
          </div>

          {complaint.description && (
            <div style={{ marginTop: '16px' }}>
              <span style={s.metaLabel}>Description</span>
              <p style={{ margin: '6px 0 0', color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                {complaint.description}
              </p>
            </div>
          )}
        </div>

        {/* Status Update Card */}
        <div style={s.card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#1e1b4b' }}>
            🔄 Update Status
          </h3>
          <div style={s.statusBtns}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateStatus(opt.value)}
                disabled={updating || status === opt.value}
                style={{
                  ...s.statusBtn,
                  backgroundColor: status === opt.value ? opt.active : opt.bg,
                  color: status === opt.value ? '#fff' : opt.color,
                  border: `2px solid ${status === opt.value ? opt.active : 'transparent'}`,
                  opacity: updating ? 0.7 : 1,
                  cursor: updating ? 'wait' : status === opt.value ? 'default' : 'pointer'
                }}
              >
                {status === opt.value ? '✓ ' : ''}{opt.label}
              </button>
            ))}
          </div>
          {updating && <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#6b7280' }}>Updating status…</p>}
        </div>

        {/* Comments Card */}
        <div style={s.card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#1e1b4b' }}>
            💬 Comments
          </h3>
          <CommentSection complaintId={id} />
        </div>
      </div>

      {/* Modal */}
      {modal.show && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>
              {modal.title === 'Success' ? '✅' : '❌'}
            </div>
            <h3 style={{ margin: '0 0 8px', color: '#1e1b4b' }}>{modal.title}</h3>
            <p style={{ margin: '0 0 20px', color: '#4b5563', fontSize: '14px' }}>{modal.message}</p>
            <button
              onClick={() => setModal({ ...modal, show: false })}
              style={s.modalBtn}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusStyle(status) {
  const map = {
    pending:       { backgroundColor: '#fef3c7', color: '#92400e' },
    'in-progress': { backgroundColor: '#dbeafe', color: '#1e40af' },
    resolved:      { backgroundColor: '#d1fae5', color: '#065f46' },
    rejected:      { backgroundColor: '#fee2e2', color: '#991b1b' }
  };
  return map[status] || { backgroundColor: '#f3f4f6', color: '#374151' };
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)',
    padding: '24px 16px 40px',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    boxSizing: 'border-box'
  },
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40vh'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  backBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '20px',
    display: 'inline-block'
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    width: '100%'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px'
  },
  headerIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0
  },
  headerTitle: {
    margin: '0 0 4px',
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff'
  },
  headerSub: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255,255,255,0.75)'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  cardTitle: {
    margin: '0 0 16px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e1b4b'
  },
  image: {
    width: '100%',
    maxHeight: '280px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '16px'
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '14px'
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  metaLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  metaValue: {
    fontSize: '14px',
    color: '#1f2937',
    fontWeight: '500'
  },
  statusBtns: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  statusBtn: {
    padding: '10px 22px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  },
  modal: {
    backgroundColor: '#fff',
    padding: '28px 32px',
    borderRadius: '16px',
    width: '320px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  modalBtn: {
    padding: '10px 32px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default ComplaintStatusPage;
