import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isAuthenticated } from '../utils/auth';
import axios from 'axios';
import LikeButton from '../components/LikeButton';
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
const API_URL = process.env.REACT_APP_API_URL || "https://civic-connect-hams.onrender.com";

const STATUS_COLORS = {
  pending:     { bg: '#fef3c7', text: '#92400e' },
  'in-progress': { bg: '#dbeafe', text: '#1e40af' },
  resolved:    { bg: '#d1fae5', text: '#065f46' },
  rejected:    { bg: '#fee2e2', text: '#991b1b' }
};

function statusPill(status) {
  const s = (status || 'pending').toLowerCase();
  const c = STATUS_COLORS[s] || { bg: '#f3f4f6', text: '#374151' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: c.bg,
      color: c.text,
      textTransform: 'capitalize'
    }}>
      {status}
    </span>
  );
}

function Dashboard() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [userComplaints, setUserComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Close sidebar on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUser(savedUser);

    const fetchData = async () => {
      try {
        const [userRes, allRes] = await Promise.all([
          axios.get(`${API_URL}/api/complaints/mine`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          axios.get(`${API_URL}/api/complaints/all`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
        ]);
        setUserComplaints(userRes.data);
        setAllComplaints(
          Array.isArray(allRes.data) ? allRes.data : allRes.data.complaints || []
        );
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, [navigate]);

  const filteredComplaints = allComplaints.filter((c) => {
    const matchSearch =
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.placeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus
      ? (c.status || '').toLowerCase() === filterStatus.toLowerCase()
      : true;
    return matchSearch && matchStatus;
  });

  const totalMine = userComplaints.length;
  const resolvedMine = userComplaints.filter(
    (c) => c.status?.toLowerCase() === 'resolved'
  ).length;
  const pendingMine = userComplaints.filter(
    (c) => c.status?.toLowerCase() === 'pending'
  ).length;

  return (
    <Layout>
      {/* Welcome card */}
      <div className="welcome-card">
        <h2>👋 Welcome back, {user.name || 'User'}!</h2>
        <p>Track and manage your civic complaints all in one place.</p>
        <button
          onClick={() => navigate('/submit-complaint')}
          style={{
            marginTop: '16px',
            padding: '10px 22px',
            background: 'rgba(255,255,255,0.2)',
            border: '1.5px solid rgba(255,255,255,0.6)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          + Submit New Complaint
        </button>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{totalMine}</div>
          <div className="stat-label">My Complaints</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{pendingMine}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{resolvedMine}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{allComplaints.length}</div>
          <div className="stat-label">Total Community</div>
        </div>
      </div>

      {/* My Complaints section */}
      {userComplaints.length > 0 && (
        <>
          <p className="section-heading">My Complaints</p>
          <p className="section-sub">Complaints you have submitted</p>
          <div className="complaint-grid">
            {userComplaints.map((c) => (
              <div
                key={c._id}
                className="complaint-card"
                onClick={() => navigate(`/complaints/${c._id}`)}
              >
                {c.imageUrl && (
                  <img
                    src={getImageSrc(c.imageUrl)}
                    alt="complaint"
                    className="complaint-card__image"
                  />
                )}
                <p className="complaint-card__title">{c.title}</p>
                <p className="complaint-card__meta">
                  📍 {c.placeName || c.location || 'Unknown'} &nbsp;•&nbsp;{' '}
                  {c.cityName || ''}
                </p>
                <p className="complaint-card__desc">{c.description}</p>
                <div className="complaint-card__footer">
                  <span className={getStatusClass(c.status)}>{c.status}</span>
                  <span className="complaint-card__meta">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <LikeButton complaintId={c._id} initialLikes={c.likes || 0} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Search/filter bar */}
      <p className="section-heading" style={{ marginTop: '36px' }}>
        Community Complaints
      </p>
      <p className="section-sub">Browse all registered civic issues</p>
      <div className="search-bar-row">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by title, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* All complaints grid */}
      {filteredComplaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔎</div>
          <p>No complaints match your search.</p>
        </div>
      ) : (
        <div className="complaint-grid">
          {filteredComplaints.map((c) => (
            <div
              key={c._id}
              className="complaint-card"
              onClick={() => navigate(`/complaints/${c._id}`)}
            >
              {c.imageUrl && (
                <img
                  src={getImageSrc(c.imageUrl)}
                  alt="complaint"
                  className="complaint-card__image"
                />
              )}
              <p className="complaint-card__title">{c.title}</p>
              <p className="complaint-card__meta">
                📍 {c.placeName || c.location || 'Unknown'}
                {c.cityName ? ` • ${c.cityName}` : ''}
              </p>
              <p className="complaint-card__meta">
                👤 {c.user?.name || 'Anonymous'}
              </p>
              <p className="complaint-card__desc">{c.description}</p>
              <div className="complaint-card__footer">
                <span className={getStatusClass(c.status)}>{c.status}</span>
                <span className="complaint-card__meta">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <LikeButton complaintId={c._id} initialLikes={c.likes || 0} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filteredComplaints = allComplaints.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={s.root}>
      {/* ── Sidebar ── */}
      <aside className={`cc-sidebar${sidebarOpen ? ' cc-sidebar-open' : ''}`} style={s.sidebar}>
        {/* Logo */}
        <div style={s.sidebarLogo}>
          <span style={{ fontSize: '22px' }}>🏛️</span>
          <span style={s.sidebarLogoText}>CivicConnect</span>
        </div>

        {/* User info */}
        <div style={s.sidebarUser}>
          <div style={s.sidebarAvatar}>{user.name ? user.name[0].toUpperCase() : 'U'}</div>
          <div>
            <div style={s.sidebarUserName}>{user.name || 'User'}</div>
            <div style={s.sidebarUserEmail}>{user.email}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={s.nav}>
          <button style={{ ...s.navBtn, ...s.navBtnActive }}>
            <span>📋</span> My Dashboard
          </button>
          <button style={s.navBtn} onClick={() => { navigate('/submit-complaint'); setSidebarOpen(false); }}>
            <span>➕</span> Add Complaint
          </button>
          <button style={s.navBtn} onClick={() => { navigate('/map-view'); setSidebarOpen(false); }}>
            <span>🗺️</span> View Map
          </button>
        </nav>

        {/* Logout at bottom */}
        <div style={s.sidebarFooter}>
          <button onClick={handleLogout} style={s.logoutBtn}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div style={s.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* ── Main Content ── */}
      <main style={s.main}>
        {/* Mobile header */}
        <div className="cc-mobile-header" style={s.mobileHeader}>
          <button style={s.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
          <span style={s.mobileTitle}>CivicConnect</span>
        </div>

        {/* Welcome card */}
        <div style={s.welcomeCard}>
          <div>
            <h2 style={s.welcomeHeading}>Welcome back, {user.name || 'User'} 👋</h2>
            <p style={s.welcomeSub}>{user.email} · {userComplaints.length} complaint{userComplaints.length !== 1 ? 's' : ''} submitted</p>
          </div>
          <button onClick={() => navigate('/submit-complaint')} style={s.addComplaintBtn}>+ Add Complaint</button>
        </div>

        {/* Stats row */}
        <div style={s.statsRow}>
          {[
            { label: 'Total Submitted', value: userComplaints.length, icon: '📝', color: '#4f46e5' },
            { label: 'Pending', value: userComplaints.filter(c => c.status === 'pending').length, icon: '⏳', color: '#f59e0b' },
            { label: 'Resolved', value: userComplaints.filter(c => c.status === 'resolved').length, icon: '✅', color: '#10b981' }
          ].map(stat => (
            <div key={stat.label} style={s.statCard}>
              <div style={{ ...s.statIcon, color: stat.color }}>{stat.icon}</div>
              <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* My Complaints */}
        {userComplaints.length > 0 && (
          <section style={s.section}>
            <h3 style={s.sectionTitle}>My Complaints</h3>
            <div style={s.cardGrid}>
              {userComplaints.map(c => (
                <div key={c._id} style={s.complaintCard}>
                  {c.imageUrl && (
                    <div className="cc-card-img-wrap" style={s.cardImgWrap}>
                      <img src={getImageSrc(c.imageUrl)} alt="complaint" style={s.cardImg} />
                    </div>
                  )}
                  <div style={s.cardContent}>
                    <div style={s.cardTopRow}>
                      <h4 style={s.cardTitle}>{c.title}</h4>
                      {statusPill(c.status)}
                    </div>
                    <p style={s.cardDesc}>{c.description}</p>
                    <div style={s.cardMeta}>
                      <span>📍 {c.cityName || c.location}</span>
                      <span>🗂️ {c.category}</span>
                      <span>📅 {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <LikeButton complaintId={c._id} initialLikes={c.likes || 0} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Complaints */}
        <section style={s.section}>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>All Community Complaints</h3>
            <div style={s.searchWrap}>
              <span style={s.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by title or location…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search complaints by title or location"
                style={s.searchInput}
              />
            </div>
          </div>

          {filteredComplaints.length === 0 ? (
            <div style={s.emptyState}>
              <span style={{ fontSize: '40px' }}>🔍</span>
              <p>No complaints match your search.</p>
            </div>
          ) : (
            <div style={s.cardGrid}>
              {filteredComplaints.map(c => (
                <div key={c._id} style={s.complaintCard}>
                  {c.imageUrl && (
                    <div className="cc-card-img-wrap" style={s.cardImgWrap}>
                      <img src={getImageSrc(c.imageUrl)} alt="complaint" style={s.cardImg} />
                    </div>
                  )}
                  <div style={s.cardContent}>
                    <div style={s.cardTopRow}>
                      <h4 style={s.cardTitle}>{c.title}</h4>
                      {statusPill(c.status)}
                    </div>
                    <p style={s.cardDesc}>{c.description}</p>
                    <div style={s.cardMeta}>
                      <span>👤 {c.user?.name || 'Unknown'}</span>
                      <span>📍 {c.cityName || c.location}</span>
                      <span>🗂️ {c.category}</span>
                    </div>
                    <LikeButton complaintId={c._id} />
                    <CommentSection complaintId={c._id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const SIDEBAR_WIDTH = '240px';

const s = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
  },
  /* Sidebar */
  sidebar: {
    width: SIDEBAR_WIDTH,
    minWidth: SIDEBAR_WIDTH,
    background: 'linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%)',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    zIndex: 100,
    transition: 'transform 0.3s',
    flexShrink: 0
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 99
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '24px 20px 16px'
  },
  sidebarLogoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: '18px',
    letterSpacing: '-0.3px'
  },
  sidebarUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    marginBottom: '8px'
  },
  sidebarAvatar: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.25)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    flexShrink: 0
  },
  sidebarUserName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px'
  },
  sidebarUserEmail: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: '12px',
    marginTop: '2px',
    wordBreak: 'break-all'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 12px',
    gap: '4px'
  },
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
    transition: 'background 0.15s, color 0.15s'
  },
  navBtnActive: {
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    fontWeight: '600'
  },
  sidebarFooter: {
    marginTop: 'auto',
    padding: '16px 12px 24px'
  },
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
    cursor: 'pointer'
  },
  /* Main */
  main: {
    flex: 1,
    overflowX: 'hidden',
    padding: '28px'
  },
  mobileHeader: {
    display: 'none'
  },
  mobileTitle: {
    fontWeight: '700',
    fontSize: '18px',
    color: '#1f2937'
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    padding: '4px'
  },
  /* Welcome */
  welcomeCard: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    borderRadius: '16px',
    padding: '24px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  welcomeHeading: {
    margin: '0 0 4px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff'
  },
  welcomeSub: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)'
  },
  addComplaintBtn: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.4)',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer'
  },
  /* Stats */
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '28px',
    flexWrap: 'wrap'
  },
  statCard: {
    flex: '1 1 120px',
    backgroundColor: '#fff',
    borderRadius: '14px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  statIcon: { fontSize: '22px', marginBottom: '8px' },
  statValue: { fontSize: '28px', fontWeight: '700', marginBottom: '4px' },
  statLabel: { fontSize: '12px', color: '#6b7280', fontWeight: '500' },
  /* Section */
  section: { marginBottom: '32px' },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '17px',
    fontWeight: '700',
    color: '#1f2937'
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    padding: '0 14px',
    gap: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  searchIcon: { fontSize: '16px', opacity: 0.5 },
  searchInput: {
    border: 'none',
    outline: 'none',
    padding: '10px 0',
    fontSize: '14px',
    width: '220px',
    backgroundColor: 'transparent',
    color: '#1f2937'
  },
  /* Card grid */
  cardGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  complaintCard: {
    backgroundColor: '#fff',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    display: 'flex',
    gap: 0
  },
  cardImgWrap: {
    width: '160px',
    minWidth: '160px',
    overflow: 'hidden',
    flexShrink: 0
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },
  cardContent: {
    padding: '16px 20px',
    flex: 1,
    minWidth: 0
  },
  cardTopRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '6px'
  },
  cardTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '700',
    color: '#1f2937',
    flex: 1
  },
  cardDesc: {
    margin: '0 0 10px',
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  cardMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '12px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
    color: '#9ca3af',
    backgroundColor: '#fff',
    borderRadius: '14px'
  }
};

export default Dashboard;
