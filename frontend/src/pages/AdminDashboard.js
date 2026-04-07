import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import AddCategory from './AddCategory';
import AdminCharts from '../components/AdminCharts';
import CommentSection from '../components/CommentSection';
import Modal from '../components/Modal';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

const getLikeCount = (likes) =>
  Array.isArray(likes) ? likes.length : (likes || 0);

const STATUS_COLORS = {
  pending:       { bg: '#fef3c7', text: '#92400e' },
  'in-progress': { bg: '#dbeafe', text: '#1e40af' },
  resolved:      { bg: '#d1fae5', text: '#065f46' },
  rejected:      { bg: '#fee2e2', text: '#991b1b' }
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
      {status || 'pending'}
    </span>
  );
}

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', message: '' });
  const navigate = useNavigate();

  const fetchData = async (page) => {
    try {
      const res = await axios.get(`${API_URL}/api/complaints/all?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      const complaintsWithCounts = (res.data.complaints || []).map(complaint => ({
        ...complaint,
        commentCount: complaint.commentCount || (complaint.comments?.length ?? 0),
        likeCount: getLikeCount(complaint.likes)
      }));

      setComplaints(complaintsWithCounts);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || page);
      setSummary({
        totalUsers: res.data.totalUsers || 0,
        totalComplaints: res.data.totalComplaints || complaintsWithCounts.length,
        statusCounts: res.data.statusCounts || {}
      });
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await axios.delete(`${API_URL}/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setComplaints(complaints.filter(c => c._id !== id));
      setModal({ show: true, title: 'Success', message: 'Complaint deleted successfully!' });
    } catch (err) {
      console.error('Error deleting complaint:', err);
      setModal({ show: true, title: 'Error', message: 'Failed to delete complaint.' });
    }
  };

  const toggleComments = (complaintId) => {
    if (selectedComplaintId === complaintId && showComments) {
      setShowComments(false);
      setSelectedComplaintId(null);
    } else {
      setSelectedComplaintId(complaintId);
      setShowComments(true);
    }
  };

  const filteredComplaints = complaints.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.placeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalComplaintsCount = summary?.totalComplaints ||
    (summary?.statusCounts ? Object.values(summary.statusCounts).reduce((a, b) => a + b, 0) : 0);

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
          <button style={{ ...s.navBtn, ...s.navBtnActive }}>
            <span>📊</span> Dashboard
          </button>
          <button style={s.navBtn} onClick={() => navigate('/admin/complaints')}>
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

      {/* Main Content */}
      <main style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.headerTitle}>Admin Dashboard</h1>
            <p style={s.headerSub}>Manage and monitor all civic complaints</p>
          </div>
          <AddCategory />
        </div>

        {/* Summary Cards */}
        <div style={s.statsRow}>
          <div style={{ ...s.statCard, borderTop: '4px solid #4f46e5' }}>
            <div style={s.statIcon}>👥</div>
            <div style={{ ...s.statValue, color: '#4f46e5' }}>{summary?.totalUsers || 0}</div>
            <div style={s.statLabel}>Total Users</div>
          </div>
          <div style={{ ...s.statCard, borderTop: '4px solid #06b6d4' }}>
            <div style={s.statIcon}>📋</div>
            <div style={{ ...s.statValue, color: '#06b6d4' }}>{totalComplaintsCount}</div>
            <div style={s.statLabel}>Total Complaints</div>
          </div>
          <div style={{ ...s.statCard, borderTop: '4px solid #f59e0b' }}>
            <div style={s.statIcon}>⏳</div>
            <div style={{ ...s.statValue, color: '#f59e0b' }}>{summary?.statusCounts?.pending || 0}</div>
            <div style={s.statLabel}>Pending</div>
          </div>
          <div style={{ ...s.statCard, borderTop: '4px solid #10b981' }}>
            <div style={s.statIcon}>✅</div>
            <div style={{ ...s.statValue, color: '#10b981' }}>{summary?.statusCounts?.resolved || 0}</div>
            <div style={s.statLabel}>Resolved</div>
          </div>
          <div style={{ ...s.statCard, borderTop: '4px solid #3b82f6' }}>
            <div style={s.statIcon}>🔄</div>
            <div style={{ ...s.statValue, color: '#3b82f6' }}>{summary?.statusCounts?.['in-progress'] || 0}</div>
            <div style={s.statLabel}>In Progress</div>
          </div>
          <div style={{ ...s.statCard, borderTop: '4px solid #ef4444' }}>
            <div style={s.statIcon}>❌</div>
            <div style={{ ...s.statValue, color: '#ef4444' }}>{summary?.statusCounts?.rejected || 0}</div>
            <div style={s.statLabel}>Rejected</div>
          </div>
        </div>

        {/* Charts */}
        <div style={s.chartCard}>
          <AdminCharts />
        </div>

        {/* Search */}
        <div style={s.searchBar}>
          <span style={s.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search complaints by title or location…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={s.searchInput}
          />
        </div>

        {/* Complaints Table */}
        <div style={s.tableCard}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Title</th>
                <th style={s.th}>Category</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>User</th>
                <th style={s.th}>Location</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>💬</th>
                <th style={s.th}>👍</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map(c => (
                <React.Fragment key={c._id}>
                  <tr style={s.tr}>
                    <td style={s.td}>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>{c.title}</span>
                    </td>
                    <td style={s.td}>{c.category}</td>
                    <td style={s.td}>{statusPill(c.status)}</td>
                    <td style={s.td}>{c.user?.name || c.createdBy?.name || 'Unknown'}</td>
                    <td style={s.td}>{c.placeName || c.location || '—'}</td>
                    <td style={s.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={s.td}>
                      <button
                        onClick={() => toggleComments(c._id)}
                        style={s.btnGray}
                      >
                        {c.commentCount || 0}
                      </button>
                    </td>
                    <td style={s.td}>{c.likeCount || 0}</td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => navigate(`/admin/complaints/${c._id}`)}
                          style={s.btnBlue}
                        >
                          Edit Status
                        </button>
                        <button
                          onClick={() => handleDeleteComplaint(c._id)}
                          style={s.btnRed}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {selectedComplaintId === c._id && showComments && (
                    <tr>
                      <td colSpan="9" style={{ ...s.td, backgroundColor: '#f8fafc' }}>
                        <CommentSection complaintId={c._id} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={s.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={paginationBtn(currentPage === 1)}
            >
              ← Previous
            </button>
            <span style={s.pageInfo}>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={paginationBtn(currentPage === totalPages)}
            >
              Next →
            </button>
          </div>
        )}
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

const paginationBtn = (disabled) => ({
  padding: '9px 20px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: disabled ? '#e5e7eb' : '#4f46e5',
  color: disabled ? '#9ca3af' : '#fff',
  fontWeight: '600',
  fontSize: '14px',
  cursor: disabled ? 'not-allowed' : 'pointer'
});

const s = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
  },
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
    flexShrink: 0
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '24px 20px 12px'
  },
  sidebarLogoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: '17px'
  },
  sidebarBadge: {
    margin: '0 20px 16px',
    padding: '3px 10px',
    background: 'rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.8)',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    display: 'inline-block'
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
    textAlign: 'left'
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
  main: {
    flex: 1,
    padding: '28px',
    overflowX: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  headerTitle: {
    margin: '0 0 4px',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937'
  },
  headerSub: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280'
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  statCard: {
    flex: '1 1 140px',
    backgroundColor: '#fff',
    borderRadius: '14px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  statIcon: { fontSize: '22px', marginBottom: '8px' },
  statValue: { fontSize: '28px', fontWeight: '700', marginBottom: '4px' },
  statLabel: { fontSize: '12px', color: '#6b7280', fontWeight: '500' },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: '14px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    padding: '0 16px',
    gap: '8px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  searchIcon: { fontSize: '16px', opacity: 0.5 },
  searchInput: {
    border: 'none',
    outline: 'none',
    padding: '12px 0',
    fontSize: '14px',
    flex: 1,
    backgroundColor: 'transparent',
    color: '#1f2937'
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: '14px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  thead: {
    background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)'
  },
  th: {
    padding: '14px 12px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background 0.15s'
  },
  td: {
    padding: '12px',
    fontSize: '13px',
    color: '#374151',
    verticalAlign: 'middle'
  },
  btnGray: {
    padding: '5px 10px',
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  btnBlue: {
    padding: '5px 10px',
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  btnRed: {
    padding: '5px 10px',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '20px'
  },
  pageInfo: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  }
};

export default AdminDashboard;
