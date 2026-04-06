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
}

function Dashboard() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [userComplaints, setUserComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

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
  );
}

export default Dashboard;
