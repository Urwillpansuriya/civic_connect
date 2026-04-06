import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import AddCategory from './AddCategory';
import AdminCharts from '../components/AdminCharts';
import CommentSection from '../components/CommentSection';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [summary, setSummary] = useState({ totalUsers: 0, totalComplaints: 0, statusCounts: {} });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', message: '' });
  const navigate = useNavigate();

  const fetchData = useCallback(async (page) => {
    try {
      const [listRes, summaryRes] = await Promise.all([
        axios.get(`${API_URL}/api/complaints/all?page=${page}&limit=10`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        }),
        axios.get(`${API_URL}/api/complaints/summary`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        })
      ]);

      const complaintsWithCounts = (listRes.data.complaints || []).map(c => ({
        ...c,
        commentCount: c.commentCount || 0,
        likeCount: c.likes ? c.likes.length : 0
      }));

      setComplaints(complaintsWithCounts);
      setTotalPages(listRes.data.totalPages || 1);
      setCurrentPage(listRes.data.currentPage || page);

      setSummary({
        totalUsers: summaryRes.data.totalUsers || 0,
        totalComplaints: summaryRes.data.totalComplaints || 0,
        statusCounts: summaryRes.data.statusCounts || {}
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  // Real-time socket updates
  useEffect(() => {
    const socket = io(API_URL, { transports: ['websocket', 'polling'] });
    const refresh = () => fetchData(currentPage);
    socket.on('complaint:new', refresh);
    socket.on('complaint:updated', refresh);
    socket.on('complaint:deleted', refresh);
    return () => {
      socket.off('complaint:new', refresh);
      socket.off('complaint:updated', refresh);
      socket.off('complaint:deleted', refresh);
      socket.disconnect();
    };
  }, [currentPage, fetchData]);

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setComplaints(prev => prev.filter(c => c._id !== id));
      setModal({ show: true, title: 'Success', message: 'Complaint deleted successfully!' });
      fetchData(currentPage);
    } catch (err) {
      console.error('Error deleting complaint:', err);
      setModal({ show: true, title: 'Error', message: 'Failed to delete complaint. Please try again.' });
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

  const getStatusPill = (status) => {
    const map = {
      pending:     { bg: '#fef3c7', color: '#92400e' },
      'in-progress': { bg: '#dbeafe', color: '#1e40af' },
      resolved:    { bg: '#d1fae5', color: '#065f46' },
      rejected:    { bg: '#fee2e2', color: '#991b1b' }
    };
    const style = map[status] || { bg: '#f3f4f6', color: '#374151' };
    return (
      <span style={{
        display: 'inline-block', padding: '4px 12px', borderRadius: '999px',
        fontSize: '12px', fontWeight: '600', textTransform: 'capitalize',
        backgroundColor: style.bg, color: style.color
      }}>
        {status}
      </span>
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const filteredComplaints = complaints.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCount = summary.totalComplaints ||
    Object.values(summary.statusCounts).reduce((a, b) => a + Number(b), 0);

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.headerTitle}>Admin Dashboard</h1>
          <p style={s.headerSub}>Manage complaints and monitor civic issues</p>
        </div>
        <AddCategory />
      </div>

      {/* Summary Cards */}
      <div style={s.statsRow}>
        <div style={{ ...s.statCard, borderTopColor: '#f59e0b' }}>
          <div style={s.statValue}>{summary.totalUsers}</div>
          <div style={s.statLabel}>Total Users</div>
        </div>
        <div style={{ ...s.statCard, borderTopColor: '#6d28d9' }}>
          <div style={s.statValue}>{totalCount}</div>
          <div style={s.statLabel}>Total Complaints</div>
        </div>
        <div style={{ ...s.statCard, borderTopColor: '#f59e0b' }}>
          <div style={{ ...s.statValue, color: '#92400e' }}>{summary.statusCounts.pending || 0}</div>
          <div style={s.statLabel}>Pending</div>
        </div>
        <div style={{ ...s.statCard, borderTopColor: '#3b82f6' }}>
          <div style={{ ...s.statValue, color: '#1e40af' }}>{summary.statusCounts['in-progress'] || 0}</div>
          <div style={s.statLabel}>In Progress</div>
        </div>
        <div style={{ ...s.statCard, borderTopColor: '#10b981' }}>
          <div style={{ ...s.statValue, color: '#065f46' }}>{summary.statusCounts.resolved || 0}</div>
          <div style={s.statLabel}>Resolved</div>
        </div>
        <div style={{ ...s.statCard, borderTopColor: '#ef4444' }}>
          <div style={{ ...s.statValue, color: '#991b1b' }}>{summary.statusCounts.rejected || 0}</div>
          <div style={s.statLabel}>Rejected</div>
        </div>
      </div>

      {/* Charts */}
      <div style={s.section}>
        <AdminCharts />
      </div>

      {/* Search */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h3 style={s.sectionTitle}>Complaints</h3>
          <input
            type="text"
            placeholder="Search by title or location…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={s.searchInput}
          />
        </div>

        {/* Table */}
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.theadRow}>
                <th style={s.th}>Title</th>
                <th style={s.th}>Category</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>User</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Comments</th>
                <th style={s.th}>Likes</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ ...s.td, textAlign: 'center', color: '#9ca3af', padding: '32px' }}>
                    No complaints found.
                  </td>
                </tr>
              ) : filteredComplaints.map(c => (
                <React.Fragment key={c._id}>
                  <tr style={s.tbodyRow}>
                    <td style={{ ...s.td, fontWeight: '600', maxWidth: '180px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.title}
                      </div>
                    </td>
                    <td style={s.td}>{c.category}</td>
                    <td style={s.td}>{getStatusPill(c.status)}</td>
                    <td style={s.td}>{c.user?.name || c.createdBy?.name || 'Unknown'}</td>
                    <td style={s.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={s.td}>
                      <button
                        onClick={() => toggleComments(c._id)}
                        style={s.btnGray}
                      >
                        💬 {c.commentCount || 0}
                      </button>
                    </td>
                    <td style={s.td}>👍 {c.likeCount || 0}</td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => navigate(`/admin/complaints/${c._id}`)}
                          style={s.btnPrimary}
                        >
                          Edit Status
                        </button>
                        <button
                          onClick={() => handleDeleteComplaint(c._id)}
                          style={s.btnDanger}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {selectedComplaintId === c._id && showComments && (
                    <tr>
                      <td colSpan="8" style={{ ...s.td, background: '#f5f3ff', padding: '16px 20px' }}>
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
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              style={currentPage === 1 ? s.pageBtn : { ...s.pageBtn, ...s.pageBtnActive }}
            >«</button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={currentPage === 1 ? s.pageBtn : { ...s.pageBtn, ...s.pageBtnActive }}
            >‹ Prev</button>
            <span style={s.pageInfo}>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={currentPage === totalPages ? s.pageBtn : { ...s.pageBtn, ...s.pageBtnActive }}
            >Next ›</button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              style={currentPage === totalPages ? s.pageBtn : { ...s.pageBtn, ...s.pageBtnActive }}
            >»</button>
          </div>
        )}
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
            <button onClick={() => setModal({ ...modal, show: false })} style={s.modalBtn}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#f5f3ff',
    padding: '28px 24px',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    background: 'linear-gradient(120deg, #4c1d95 0%, #6d28d9 60%, #7c3aed 100%)',
    borderRadius: '16px',
    padding: '24px 28px',
    marginBottom: '28px',
    color: '#fff'
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
    color: 'rgba(255,255,255,0.8)'
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
    marginBottom: '28px'
  },
  statCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '18px 20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    borderTop: '4px solid #6d28d9'
  },
  statValue: {
    fontSize: '30px',
    fontWeight: '700',
    color: '#4c1d95',
    lineHeight: 1
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '6px'
  },
  section: {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    marginBottom: '24px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '16px'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e1b4b'
  },
  searchInput: {
    padding: '9px 16px',
    borderRadius: '999px',
    border: '1.5px solid #e5e7eb',
    fontSize: '14px',
    outline: 'none',
    minWidth: '220px',
    background: '#f9fafb'
  },
  tableWrap: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  theadRow: {
    background: '#f5f3ff'
  },
  th: {
    padding: '12px 14px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '700',
    color: '#4c1d95',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #ede9fe',
    whiteSpace: 'nowrap'
  },
  tbodyRow: {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background 0.15s'
  },
  td: {
    padding: '12px 14px',
    color: '#374151',
    verticalAlign: 'middle'
  },
  btnPrimary: {
    padding: '6px 14px',
    background: 'linear-gradient(90deg, #6d28d9, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  btnDanger: {
    padding: '6px 14px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnGray: {
    padding: '5px 12px',
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '20px',
    flexWrap: 'wrap'
  },
  pageBtn: {
    padding: '7px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    background: '#f9fafb',
    color: '#9ca3af',
    fontSize: '14px',
    cursor: 'not-allowed'
  },
  pageBtnActive: {
    background: '#fff',
    color: '#6d28d9',
    borderColor: '#6d28d9',
    cursor: 'pointer'
  },
  pageInfo: {
    fontSize: '14px',
    color: '#4b5563',
    padding: '0 8px'
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

export default AdminDashboard;
