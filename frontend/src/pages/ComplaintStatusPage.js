import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';
import Modal from '../components/Modal';
import CommentSection from '../components/CommentSection';
import getImageSrc from '../utils/image';
import '../components/Layout.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

const STATUS_CONFIG = {
  pending:       { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', label: 'Pending',     icon: '⏳', activeColor: '#f59e0b' },
  'in-progress': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd', label: 'In Progress', icon: '🔄', activeColor: '#3b82f6' },
  resolved:      { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7', label: 'Resolved',    icon: '✅', activeColor: '#10b981' },
  rejected:      { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', label: 'Rejected',    icon: '❌', activeColor: '#ef4444' },
};

function StatusPill({ status }) {
  const key = (status || 'pending').toLowerCase();
  const cfg = STATUS_CONFIG[key] || { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb', label: status, icon: '📋' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '4px 14px',
      borderRadius: '999px',
      fontSize: '13px',
      fontWeight: '600',
      backgroundColor: cfg.bg,
      color: cfg.text,
      border: `1.5px solid ${cfg.border}`,
      textTransform: 'capitalize',
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function MetaItem({ label, value }) {
  return (
    <div style={s.metaItem}>
      <span style={s.metaLabel}>{label}</span>
      <span style={s.metaValue}>{value || '—'}</span>
    </div>
  );
}

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
      console.error('Error loading complaint:', err);
    });
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await axios.patch(`${API_URL}/api/complaints/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setStatus(newStatus);
      setComplaint(prev => ({ ...prev, status: newStatus }));
      setModal({ show: true, title: 'Status Updated', message: `Complaint marked as "${newStatus}".` });
    } catch (err) {
      setModal({ show: true, title: 'Error', message: 'Failed to update status. Please try again.' });
    } finally {
      setUpdating(false);
    }
  };

  if (!complaint) {
    return (
      <div style={s.root}>
        <div style={s.loadingCard}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>⏳</div>
          <p style={{ color: '#6b7280', margin: 0 }}>Loading complaint details…</p>
        </div>
      </div>
    );
  }

  const statusButtons = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({ key, ...cfg }));

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <span style={{ fontSize: '22px' }}>🏛️</span>
          <span style={s.sidebarLogoText}>CivicConnect</span>
        </div>
        <div style={s.sidebarBadge}>ADMIN</div>
        <nav style={s.nav}>
          <button style={s.navBtn} onClick={() => navigate('/admin')}>
            <span>📊</span> Dashboard
          </button>
          <button style={{ ...s.navBtn, ...s.navBtnActive }}>
            <span>📋</span> Complaints
          </button>
          <button style={s.navBtn} onClick={() => navigate('/')}>
            <span>🌐</span> Public View
          </button>
        </nav>
        <div style={s.sidebarFooter}>
          <button
            onClick={() => { localStorage.clear(); navigate('/admin-login'); }}
            style={s.logoutBtn}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={s.main}>
        <button onClick={() => navigate('/admin')} style={s.backBtn}>
          ← Back to Dashboard
        </button>

        <div style={s.pageTitle}>
          <h1 style={s.heading}>Complaint Details</h1>
          <p style={s.subheading}>Review and manage this civic complaint</p>
        </div>

        <div style={s.contentGrid}>
          {/* Left column — complaint info */}
          <div style={s.leftCol}>
            {/* Info card */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={s.complaintTitle}>{complaint.title}</h2>
                  <div style={{ marginTop: '8px' }}>
                    <StatusPill status={status} />
                  </div>
                </div>
                <div style={s.likeBadge}>
                  👍 {Array.isArray(complaint.likes) ? complaint.likes.length : (complaint.likes || 0)}
                </div>
              </div>

              {complaint.imageUrl && (
                <img
                  src={getImageSrc(complaint.imageUrl)}
                  alt="Complaint"
                  style={s.image}
                />
              )}

              <div style={s.section}>
                <h3 style={s.sectionTitle}>📝 Description</h3>
                <p style={s.description}>{complaint.description}</p>
              </div>

              <div style={s.metaGrid}>
                <MetaItem label="Category"     value={complaint.category} />
                <MetaItem label="Submitted by" value={complaint.user?.name || complaint.createdBy?.name || 'Anonymous'} />
                <MetaItem label="Date"         value={new Date(complaint.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                <MetaItem label="Location"     value={complaint.location} />
                <MetaItem label="Place"        value={complaint.placeName} />
                <MetaItem label="Area"         value={complaint.areaName} />
                <MetaItem label="City"         value={complaint.cityName} />
              </div>
            </div>

            {/* Comments card */}
            <div style={s.card}>
              <h3 style={s.sectionTitle}>💬 Comments</h3>
              <CommentSection complaintId={id} />
            </div>
          </div>

          {/* Right column — status management */}
          <div style={s.rightCol}>
            {/* Status update card */}
            <div style={s.card}>
              <h3 style={s.sectionTitle}>🔧 Update Status</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px', marginTop: 0 }}>
                Change the current status of this complaint.
              </p>
              <div style={s.statusBtnGroup}>
                {statusButtons.map(({ key, label, icon, activeColor }) => {
                  const isActive = status === key;
                  return (
                    <button
                      key={key}
                      onClick={() => updateStatus(key)}
                      disabled={updating}
                      style={{
                        ...s.statusBtn,
                        backgroundColor: isActive ? activeColor : '#f9fafb',
                        color: isActive ? '#fff' : '#374151',
                        border: isActive ? `1.5px solid ${activeColor}` : '1.5px solid #e5e7eb',
                        fontWeight: isActive ? '700' : '500',
                        opacity: updating ? 0.7 : 1,
                        cursor: updating ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {icon} {label}
                    </button>
                  );
                })}
              </div>
              <div style={s.currentStatusBox}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Current:</span>
                <StatusPill status={status} />
              </div>
            </div>

            {/* Quick info card */}
            <div style={{ ...s.card, background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', border: '1px solid #ddd6fe' }}>
              <h3 style={{ ...s.sectionTitle, color: '#5b21b6' }}>📌 Quick Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { icon: '🏷️', label: 'Category',    value: complaint.category },
                  { icon: '👤', label: 'Reported by', value: complaint.user?.name || complaint.createdBy?.name || 'Anonymous' },
                  { icon: '📅', label: 'Date',        value: new Date(complaint.createdAt).toLocaleDateString() },
                  { icon: '📍', label: 'Location',    value: complaint.placeName || complaint.location },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={s.quickInfoRow}>
                    <span style={s.quickInfoIcon}>{icon}</span>
                    <div>
                      <div style={s.quickInfoLabel}>{label}</div>
                      <div style={s.quickInfoValue}>{value || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────── */
const s = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },

  /* Sidebar */
  sidebar: {
    width: '220px',
    minWidth: '220px',
    background: 'linear-gradient(180deg, #1e1b4b 0%, #4f46e5 100%)',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    flexShrink: 0,
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '24px 20px 12px',
  },
  sidebarLogoText: { color: '#fff', fontWeight: '700', fontSize: '17px' },
  sidebarBadge: {
    margin: '0 20px 16px',
    padding: '3px 10px',
    background: 'rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.8)',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    display: 'inline-block',
  },
  nav: { display: 'flex', flexDirection: 'column', padding: '0 12px', gap: '4px' },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 14px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.75)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
  },
  navBtnActive: { background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: '600' },
  sidebarFooter: { marginTop: 'auto', padding: '16px 12px 24px' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(239,68,68,0.2)',
    color: '#fca5a5',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  /* Main */
  main: { flex: 1, padding: '28px 32px', overflowX: 'hidden', minWidth: 0 },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0 0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'inherit',
  },
  pageTitle: { marginBottom: '24px' },
  heading: { margin: '0 0 4px', fontSize: '24px', fontWeight: '700', color: '#1f2937' },
  subheading: { margin: 0, fontSize: '14px', color: '#6b7280' },

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '24px',
    alignItems: 'start',
  },
  leftCol:  { display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '24px' },

  /* Card */
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    padding: '24px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '20px',
  },
  complaintTitle: { margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937', lineHeight: '1.35' },
  likeBadge: {
    background: '#f0fdf4',
    color: '#15803d',
    border: '1px solid #bbf7d0',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    maxHeight: '340px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '20px',
    display: 'block',
  },
  section: { marginBottom: '20px' },
  sectionTitle: { margin: '0 0 12px', fontSize: '15px', fontWeight: '700', color: '#1f2937' },
  description: { margin: 0, fontSize: '14px', color: '#374151', lineHeight: '1.7' },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '14px',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px',
  },
  metaItem:  { display: 'flex', flexDirection: 'column', gap: '3px' },
  metaLabel: { fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' },
  metaValue: { fontSize: '14px', color: '#1f2937', fontWeight: '500' },

  /* Loading */
  loadingCard: {
    margin: 'auto',
    marginTop: '120px',
    textAlign: 'center',
    padding: '60px 40px',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    maxWidth: '400px',
  },

  /* Status buttons */
  statusBtnGroup: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  statusBtn: {
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  },
  currentStatusBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
  },

  /* Quick info */
  quickInfoRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  quickInfoIcon: {
    fontSize: '18px',
    flexShrink: 0,
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '8px',
  },
  quickInfoLabel: { fontSize: '11px', color: '#8b5cf6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px' },
  quickInfoValue: { fontSize: '14px', color: '#1f2937', fontWeight: '500' },
};

export default ComplaintStatusPage;
