import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getImageSrc from '../utils/image';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

const STATUS_CONFIG = {
  pending:       { bg: '#fef3c7', text: '#92400e', icon: '⏳', label: 'Pending' },
  'in-progress': { bg: '#dbeafe', text: '#1e40af', icon: '🔄', label: 'In Progress' },
  resolved:      { bg: '#d1fae5', text: '#065f46', icon: '✅', label: 'Resolved' },
  rejected:      { bg: '#fee2e2', text: '#991b1b', icon: '❌', label: 'Rejected' },
};

function StatusBadge({ status }) {
  const key = (status || 'pending').toLowerCase();
  const cfg = STATUS_CONFIG[key] || { bg: '#f3f4f6', text: '#374151', icon: '📋', label: status };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: cfg.bg,
      color: cfg.text,
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function PublicDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: currentPage, limit: 9 });
      if (filterStatus) params.append('status', filterStatus);
      const res = await axios.get(`${API_URL}/api/complaints?${params.toString()}`);
      if (res.data && res.data.complaints) {
        setComplaints(res.data.complaints);
        setTotalPages(res.data.totalPages || 1);
        setTotalComplaints(res.data.totalComplaints || res.data.complaints.length);
        setStatusCounts(res.data.statusCounts || {});
      } else {
        const list = Array.isArray(res.data) ? res.data : [];
        setComplaints(list);
        setTotalComplaints(list.length);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status === filterStatus ? '' : status);
    setCurrentPage(1);
  };

  const resolvedCount = statusCounts.resolved || complaints.filter(c => c.status === 'resolved').length;
  const pendingCount = statusCounts.pending || complaints.filter(c => c.status === 'pending').length;
  const inProgressCount = statusCounts['in-progress'] || complaints.filter(c => c.status === 'in-progress').length;

  return (
    <div style={s.root}>
      {/* ── Navbar ── */}
      <header style={s.navbar}>
        <div style={s.navInner}>
          <div style={s.brand}>
            <span style={s.brandIcon}>🏛️</span>
            <span style={s.brandText}>CivicConnect</span>
          </div>
          <nav style={s.navLinks}>
            <button style={s.navLinkBtn} onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button style={s.navCta} onClick={() => navigate('/register')}>
              Join Now
            </button>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={s.hero}>
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <div style={s.heroBadge}>🗺️ Community Dashboard</div>
          <h1 style={s.heroTitle}>Your Community,<br />Your Voice</h1>
          <p style={s.heroSub}>
            Track civic issues, monitor progress, and see your community come together.
            Transparent governance starts here.
          </p>
          <div style={s.heroActions}>
            <button style={s.heroPrimaryBtn} onClick={() => navigate('/register')}>
              Report an Issue
            </button>
            <button style={s.heroSecondaryBtn} onClick={() => navigate('/login')}>
              View My Reports
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={s.statsSection}>
        <div style={s.statsGrid}>
          <div style={{ ...s.statCard, borderTop: '4px solid #6366f1' }}>
            <div style={s.statIcon}>📋</div>
            <div style={{ ...s.statNum, color: '#6366f1' }}>{totalComplaints}</div>
            <div style={s.statLabel}>Total Reports</div>
          </div>
          <div
            style={{ ...s.statCard, borderTop: '4px solid #10b981', cursor: 'pointer', outline: filterStatus === 'resolved' ? '2px solid #10b981' : 'none' }}
            onClick={() => handleFilterChange('resolved')}
          >
            <div style={s.statIcon}>✅</div>
            <div style={{ ...s.statNum, color: '#10b981' }}>{resolvedCount}</div>
            <div style={s.statLabel}>Resolved</div>
          </div>
          <div
            style={{ ...s.statCard, borderTop: '4px solid #3b82f6', cursor: 'pointer', outline: filterStatus === 'in-progress' ? '2px solid #3b82f6' : 'none' }}
            onClick={() => handleFilterChange('in-progress')}
          >
            <div style={s.statIcon}>🔄</div>
            <div style={{ ...s.statNum, color: '#3b82f6' }}>{inProgressCount}</div>
            <div style={s.statLabel}>In Progress</div>
          </div>
          <div
            style={{ ...s.statCard, borderTop: '4px solid #f59e0b', cursor: 'pointer', outline: filterStatus === 'pending' ? '2px solid #f59e0b' : 'none' }}
            onClick={() => handleFilterChange('pending')}
          >
            <div style={s.statIcon}>⏳</div>
            <div style={{ ...s.statNum, color: '#f59e0b' }}>{pendingCount}</div>
            <div style={s.statLabel}>Pending</div>
          </div>
        </div>
        {filterStatus && (
          <div style={s.filterPill}>
            Showing: <strong style={{ textTransform: 'capitalize' }}>{filterStatus}</strong>
            <button style={s.clearFilter} onClick={() => { setFilterStatus(''); setCurrentPage(1); }}>✕ Clear</button>
          </div>
        )}
      </section>

      {/* ── Complaints Grid ── */}
      <main style={s.main}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Recent Reports</h2>
          <p style={s.sectionSub}>Community issues submitted by residents</p>
        </div>

        {loading ? (
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <p style={s.loadingText}>Loading reports…</p>
          </div>
        ) : complaints.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>📭</div>
            <h3 style={s.emptyTitle}>No reports found</h3>
            <p style={s.emptySub}>
              {filterStatus ? `No ${filterStatus} complaints at the moment.` : 'Be the first to report a civic issue!'}
            </p>
            <button style={s.heroPrimaryBtn} onClick={() => navigate('/register')}>Submit a Report</button>
          </div>
        ) : (
          <div style={s.grid}>
            {complaints.map(c => (
              <article key={c._id} style={s.card}>
                {c.imageUrl && (
                  <div style={s.cardImgWrap}>
                    <img
                      src={getImageSrc(c.imageUrl)}
                      alt={c.title}
                      style={s.cardImg}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
                <div style={s.cardBody}>
                  <div style={s.cardMeta}>
                    <StatusBadge status={c.status} />
                    {c.category && <span style={s.categoryTag}>{c.category}</span>}
                  </div>
                  <h3 style={s.cardTitle}>{c.title}</h3>
                  <p style={s.cardDesc}>{c.description}</p>
                  <div style={s.cardFooter}>
                    <span style={s.cardInfo}>
                      <span style={s.infoIcon}>📍</span>
                      {c.placeName || c.location || 'Unknown location'}
                    </span>
                    <span style={s.cardInfo}>
                      <span style={s.infoIcon}>👤</span>
                      {c.user?.name || c.createdBy?.name || 'Anonymous'}
                    </span>
                    {c.createdAt && (
                      <span style={s.cardInfo}>
                        <span style={s.infoIcon}>📅</span>
                        {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                    {Array.isArray(c.likes) && c.likes.length > 0 && (
                      <span style={s.cardInfo}>
                        <span style={s.infoIcon}>👍</span>
                        {c.likes.length}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

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
            <div style={s.pageNumbers}>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={currentPage === page ? s.pageNumActive : s.pageNum}
                  >
                    {page}
                  </button>
                );
              })}
              {totalPages > 7 && <span style={s.pageEllipsis}>…</span>}
            </div>
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

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerBrand}>
            <span style={{ fontSize: '20px' }}>🏛️</span>
            <span style={s.footerBrandText}>CivicConnect</span>
          </div>
          <p style={s.footerText}>Empowering communities through transparent civic engagement.</p>
          <div style={s.footerLinks}>
            <button style={s.footerLink} onClick={() => navigate('/login')}>Sign In</button>
            <span style={s.footerDivider}>·</span>
            <button style={s.footerLink} onClick={() => navigate('/register')}>Register</button>
            <span style={s.footerDivider}>·</span>
            <button style={s.footerLink} onClick={() => navigate('/admin-login')}>Admin</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

const paginationBtn = (disabled) => ({
  padding: '10px 22px',
  border: 'none',
  borderRadius: '10px',
  backgroundColor: disabled ? '#e5e7eb' : '#6366f1',
  color: disabled ? '#9ca3af' : '#fff',
  fontWeight: '600',
  fontSize: '14px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'background 0.2s',
});

const s = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },

  /* Navbar */
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  navInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandIcon: { fontSize: '24px' },
  brandText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: '-0.3px',
  },
  navLinks: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLinkBtn: {
    padding: '8px 18px',
    background: 'transparent',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
  },
  navCta: {
    padding: '8px 18px',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
  },

  /* Hero */
  hero: {
    position: 'relative',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #7c3aed 100%)',
    padding: '80px 24px 100px',
    textAlign: 'center',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroContent: { position: 'relative', maxWidth: '700px', margin: '0 auto' },
  heroBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(4px)',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '24px',
    letterSpacing: '0.5px',
  },
  heroTitle: {
    margin: '0 0 20px',
    fontSize: 'clamp(32px, 6vw, 52px)',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.15',
    letterSpacing: '-1px',
  },
  heroSub: {
    margin: '0 0 36px',
    fontSize: '16px',
    color: 'rgba(255,255,255,0.82)',
    lineHeight: '1.7',
    maxWidth: '540px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heroActions: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  heroPrimaryBtn: {
    padding: '14px 32px',
    background: '#fff',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  heroSecondaryBtn: {
    padding: '14px 32px',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.35)',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  /* Stats */
  statsSection: {
    maxWidth: '1200px',
    margin: '-40px auto 0',
    padding: '0 24px',
    position: 'relative',
    zIndex: 10,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  statIcon: { fontSize: '26px', marginBottom: '10px' },
  statNum: { fontSize: '32px', fontWeight: '800', marginBottom: '4px', lineHeight: '1' },
  statLabel: { fontSize: '13px', color: '#6b7280', fontWeight: '500' },
  filterPill: {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151',
  },
  clearFilter: {
    padding: '3px 10px',
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    color: '#374151',
    fontWeight: '600',
  },

  /* Main */
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 24px 60px',
    flex: 1,
  },
  sectionHeader: { marginBottom: '32px' },
  sectionTitle: {
    margin: '0 0 6px',
    fontSize: '26px',
    fontWeight: '700',
    color: '#111827',
  },
  sectionSub: { margin: 0, fontSize: '14px', color: '#6b7280' },

  /* Loading */
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '80px 0',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: { fontSize: '15px', color: '#6b7280' },

  /* Empty state */
  emptyState: {
    textAlign: 'center',
    padding: '80px 24px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: { margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: '#1f2937' },
  emptySub: { margin: '0 0 24px', fontSize: '14px', color: '#6b7280' },

  /* Grid */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #f1f5f9',
  },
  cardImgWrap: {
    width: '100%',
    height: '180px',
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  cardBody: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' },
  cardMeta: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' },
  categoryTag: {
    display: 'inline-block',
    padding: '3px 10px',
    background: '#f0f0ff',
    color: '#6366f1',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardTitle: {
    margin: '0 0 8px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: '1.4',
  },
  cardDesc: {
    margin: '0 0 16px',
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.6',
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardFooter: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    paddingTop: '14px',
    borderTop: '1px solid #f3f4f6',
    marginTop: 'auto',
  },
  cardInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: '500',
  },
  infoIcon: { fontSize: '13px' },

  /* Pagination */
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '48px',
    flexWrap: 'wrap',
  },
  pageNumbers: { display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' },
  pageNum: {
    width: '36px',
    height: '36px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    background: '#fff',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumActive: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '8px',
    background: '#6366f1',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'default',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageEllipsis: { fontSize: '14px', color: '#9ca3af', alignSelf: 'center' },

  /* Footer */
  footer: {
    backgroundColor: '#1f2937',
    padding: '32px 24px',
    color: '#fff',
  },
  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'center',
  },
  footerBrand: { display: 'flex', alignItems: 'center', gap: '8px' },
  footerBrandText: { fontSize: '16px', fontWeight: '700' },
  footerText: { margin: 0, fontSize: '13px', color: '#9ca3af' },
  footerLinks: { display: 'flex', alignItems: 'center', gap: '8px' },
  footerLink: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '0',
    fontWeight: '500',
  },
  footerDivider: { color: '#4b5563', fontSize: '13px' },
};

export default PublicDashboard;










