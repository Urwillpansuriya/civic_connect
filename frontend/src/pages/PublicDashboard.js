import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getImageSrc from '../utils/image';
import './PublicDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';
const COMPLAINTS_PER_PAGE = 9;
const PAGE_WINDOW_SIZE = 3;

const IMAGE_PLACEHOLDER_URI =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%25" height="180" viewBox="0 0 400 180"><rect fill="%23f1f5f9" width="400" height="180"/><text fill="%23cbd5e1" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle">Image unavailable</text></svg>';

const STATUS_CONFIG = {
  pending:       { bg: '#fef3c7', text: '#92400e', icon: '⏳', label: 'Pending' },
  'in-progress': { bg: '#dbeafe', text: '#1e40af', icon: '🔄', label: 'In Progress' },
  resolved:      { bg: '#d1fae5', text: '#065f46', icon: '✅', label: 'Resolved' },
  rejected:      { bg: '#fee2e2', text: '#991b1b', icon: '❌', label: 'Rejected' },
};

const CATEGORY_ICONS = {
  road:           '🛣️',
  water:          '💧',
  electricity:    '⚡',
  sanitation:     '🗑️',
  drainage:       '🚰',
  streetlight:    '💡',
  parks:          '🌳',
  noise:          '📢',
  safety:         '🦺',
  infrastructure: '🏗️',
  environment:    '🌿',
  transport:      '🚌',
  default:        '📋',
};

function getCategoryIcon(category) {
  if (!category) return CATEGORY_ICONS.default;
  const key = category.toLowerCase().replace(/\s+/g, '');
  for (const [k, v] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return v;
  }
  return CATEGORY_ICONS.default;
}

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

function SkeletonCard() {
  return (
    <div style={s.card}>
      <div className="pd-skeleton" style={{ height: '180px', borderRadius: '0' }} />
      <div style={{ padding: '20px' }}>
        <div className="pd-skeleton" style={{ height: '20px', width: '60%', marginBottom: '12px' }} />
        <div className="pd-skeleton" style={{ height: '16px', marginBottom: '8px' }} />
        <div className="pd-skeleton" style={{ height: '16px', width: '80%', marginBottom: '8px' }} />
        <div className="pd-skeleton" style={{ height: '16px', width: '55%', marginBottom: '24px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="pd-skeleton" style={{ height: '12px', width: '80px' }} />
          <div className="pd-skeleton" style={{ height: '12px', width: '80px' }} />
        </div>
      </div>
    </div>
  );
}

function ComplaintCard({ complaint, onClick }) {
  const c = complaint;
  const categoryIcon = getCategoryIcon(c.category);

  return (
    <article
      className="pd-card"
      style={s.card}
      onClick={() => onClick(c._id)}
      tabIndex={0}
      role="button"
      aria-label={`View details for: ${c.title}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(c._id); }}
    >
      {c.imageUrl ? (
        <div className="pd-card-img-wrap" style={s.cardImgWrap}>
          <img
            src={getImageSrc(c.imageUrl)}
            alt={c.title}
            style={s.cardImg}
            loading="lazy"
            onError={(e) => {
              e.target.src = IMAGE_PLACEHOLDER_URI;
              e.target.alt = 'Image unavailable';
            }}
          />
        </div>
      ) : (
        <div style={{ ...s.cardImgWrap, ...s.cardImgPlaceholder }}>
          <span style={{ fontSize: '36px' }}>{categoryIcon}</span>
          <span style={s.cardImgPlaceholderText}>{c.category || 'Civic Issue'}</span>
        </div>
      )}

      <div style={s.cardBody}>
        <div style={s.cardMeta}>
          <StatusBadge status={c.status} />
          {c.category && (
            <span style={s.categoryTag}>
              {categoryIcon} {c.category}
            </span>
          )}
        </div>

        <h3 style={s.cardTitle}>{c.title}</h3>
        <p style={s.cardDesc}>{c.description}</p>

        <div style={s.cardFooter}>
          <span style={s.cardInfo}>
            <span style={s.infoIcon}>📍</span>
            <span>{c.placeName || c.location || 'Unknown location'}</span>
          </span>
          <span style={s.cardInfo}>
            <span style={s.infoIcon}>👤</span>
            <span>{c.user?.name || c.createdBy?.name || 'Anonymous'}</span>
          </span>
          {c.createdAt && (
            <span style={s.cardInfo}>
              <span style={s.infoIcon}>📅</span>
              <span>
                {new Date(c.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </span>
          )}
          {Array.isArray(c.likes) && c.likes.length > 0 && (
            <span style={s.cardInfo}>
              <span style={s.infoIcon}>👍</span>
              <span>{c.likes.length}</span>
            </span>
          )}
        </div>

        <button
          className="pd-view-btn"
          onClick={(e) => { e.stopPropagation(); onClick(c._id); }}
          aria-label={`View details for ${c.title}`}
        >
          View Details →
        </button>
      </div>
    </article>
  );
}

function PublicDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const navigate = useNavigate();

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, debouncedSearch]);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: currentPage, limit: COMPLAINTS_PER_PAGE });
      if (filterStatus) params.append('status', filterStatus);
      if (debouncedSearch) params.append('search', debouncedSearch);
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
      setError('Unable to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus, debouncedSearch]);

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
    setFilterStatus(prev => (prev === status ? '' : status));
  };

  const handleCardClick = (id) => {
    navigate(`/complaints/${id}`);
  };

  const localCounts = useMemo(
    () =>
      complaints.reduce((acc, c) => {
        const key = (c.status || 'pending').toLowerCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    [complaints]
  );
  const resolvedCount    = statusCounts.resolved       || localCounts.resolved       || 0;
  const pendingCount     = statusCounts.pending        || localCounts.pending        || 0;
  const inProgressCount  = statusCounts['in-progress'] || localCounts['in-progress'] || 0;

  const hasActiveFilters = filterStatus || debouncedSearch;

  const statsData = [
    { key: '',            color: '#6366f1', icon: '📋', count: totalComplaints, label: 'Total Reports' },
    { key: 'resolved',    color: '#10b981', icon: '✅', count: resolvedCount,   label: 'Resolved' },
    { key: 'in-progress', color: '#3b82f6', icon: '🔄', count: inProgressCount, label: 'In Progress' },
    { key: 'pending',     color: '#f59e0b', icon: '⏳', count: pendingCount,    label: 'Pending' },
  ];

  return (
    <div style={s.root}>
      {/* ── Navbar ── */}
      <header style={s.navbar}>
        <div style={s.navInner}>
          <div style={s.brand}>
            <span style={s.brandIcon}>🏛️</span>
            <span className="pd-brand-text" style={s.brandText}>CivicConnect</span>
          </div>
          <nav className="pd-nav-links" style={s.navLinks}>
            <button
              className="pd-nav-link-btn"
              style={s.navLinkBtn}
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button
              className="pd-nav-cta"
              style={s.navCta}
              onClick={() => navigate('/register')}
            >
              Join Now
            </button>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pd-hero" style={s.hero}>
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <div style={s.heroBadge}>🗺️ Community Dashboard</div>
          <h1 style={s.heroTitle}>
            Your Community,<br />Your Voice
          </h1>
          <p style={s.heroSub}>
            Track civic issues, monitor progress, and see your community come together.
            Transparent governance starts here.
          </p>
          <div className="pd-hero-actions" style={s.heroActions}>
            <button
              className="pd-hero-primary"
              style={s.heroPrimaryBtn}
              onClick={() => navigate('/register')}
            >
              🚩 Report an Issue
            </button>
            <button
              className="pd-hero-secondary"
              style={s.heroSecondaryBtn}
              onClick={() => navigate('/login')}
            >
              📊 View My Reports
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={s.statsSection}>
        <div className="pd-stats-grid" style={s.statsGrid}>
          {statsData.map(({ key, color, icon, count, label }) => {
            const isActive = filterStatus === key && key !== '';
            const isClickable = key !== '';
            return (
              <div
                key={key || 'total'}
                className={`pd-stat-card${isActive ? ' pd-stat-card--active' : ''}`}
                style={{
                  ...s.statCard,
                  borderTop: `4px solid ${color}`,
                  cursor: isClickable ? 'pointer' : 'default',
                }}
                onClick={isClickable ? () => handleFilterChange(key) : undefined}
                role={isClickable ? 'button' : undefined}
                aria-pressed={isClickable ? isActive : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={isClickable ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleFilterChange(key);
                } : undefined}
              >
                <div style={s.statIcon}>{icon}</div>
                <div style={{ ...s.statNum, color }}>{count}</div>
                <div style={s.statLabel}>{label}</div>
                {isActive && (
                  <div style={{ ...s.filterActiveDot, background: color }} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Complaints Grid ── */}
      <main style={s.main}>
        <div className="pd-section-top">
          <div>
            <h2 style={s.sectionTitle}>Recent Reports</h2>
            <p style={s.sectionSub}>
              {hasActiveFilters
                ? `Filtered results${totalComplaints ? ` · ${totalComplaints} found` : ''}`
                : 'Community issues submitted by residents'}
            </p>
          </div>

          {/* Search bar */}
          <div className="pd-search-wrap">
            <span className="pd-search-icon">🔍</span>
            <input
              className="pd-search-input"
              type="text"
              placeholder="Search reports…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search complaints"
            />
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="pd-filter-bar" style={{ marginBottom: '20px' }}>
            {filterStatus && (
              <button
                className="pd-filter-chip pd-filter-chip--active"
                style={{ background: '#f0f0ff', color: '#4f46e5' }}
                onClick={() => setFilterStatus('')}
              >
                {STATUS_CONFIG[filterStatus]?.icon} {filterStatus} ✕
              </button>
            )}
            {debouncedSearch && (
              <button
                className="pd-filter-chip pd-filter-chip--active"
                style={{ background: '#f0fdf4', color: '#16a34a' }}
                onClick={() => setSearchQuery('')}
              >
                🔍 "{debouncedSearch}" ✕
              </button>
            )}
            <button
              className="pd-filter-chip"
              style={{ background: '#f3f4f6', color: '#374151' }}
              onClick={() => { setFilterStatus(''); setSearchQuery(''); setCurrentPage(1); }}
            >
              Clear all
            </button>
          </div>
        )}

        {loading ? (
          <div>
            {/* Skeleton grid */}
            <div className="pd-grid" style={s.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div style={s.errorState}>
            <div style={s.emptyIcon}>⚠️</div>
            <h3 style={s.emptyTitle}>Something went wrong</h3>
            <p style={s.emptySub}>{error}</p>
            <button style={s.heroPrimaryBtn} onClick={fetchComplaints}>Retry</button>
          </div>
        ) : complaints.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>📭</div>
            <h3 style={s.emptyTitle}>No reports found</h3>
            <p style={s.emptySub}>
              {hasActiveFilters
                ? 'No complaints match your current filters. Try adjusting your search.'
                : 'Be the first to report a civic issue in your community!'}
            </p>
            {hasActiveFilters ? (
              <button
                style={s.heroPrimaryBtn}
                onClick={() => { setFilterStatus(''); setSearchQuery(''); }}
              >
                Clear Filters
              </button>
            ) : (
              <button style={s.heroPrimaryBtn} onClick={() => navigate('/register')}>
                Submit a Report
              </button>
            )}
          </div>
        ) : (
          <div className="pd-grid" style={s.grid}>
            {complaints.map(c => (
              <ComplaintCard key={c._id} complaint={c} onClick={handleCardClick} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div style={s.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={paginationBtn(currentPage === 1)}
              aria-label="Previous page"
            >
              ← Previous
            </button>

            <div style={s.pageNumbers}>
              {(() => {
                const start = Math.max(1, currentPage - PAGE_WINDOW_SIZE);
                const end   = Math.min(totalPages, currentPage + PAGE_WINDOW_SIZE);
                const pages = [];
                if (start > 1) {
                  pages.push(
                    <button key={1} onClick={() => handlePageChange(1)} style={s.pageNum}>1</button>
                  );
                  if (start > 2) pages.push(<span key="start-ellipsis" style={s.pageEllipsis}>…</span>);
                }
                for (let p = start; p <= end; p++) {
                  pages.push(
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      style={currentPage === p ? s.pageNumActive : s.pageNum}
                      aria-current={currentPage === p ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  );
                }
                if (end < totalPages) {
                  if (end < totalPages - 1) pages.push(<span key="end-ellipsis" style={s.pageEllipsis}>…</span>);
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageChange(totalPages)}
                      style={s.pageNum}
                    >
                      {totalPages}
                    </button>
                  );
                }
                return pages;
              })()}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={paginationBtn(currentPage === totalPages)}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}

        {/* Page info */}
        {totalPages > 1 && !loading && (
          <p style={s.pageInfo}>
            Page {currentPage} of {totalPages} · {totalComplaints} total report{totalComplaints !== 1 ? 's' : ''}
          </p>
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
            <button className="pd-footer-link" style={s.footerLink} onClick={() => navigate('/login')}>
              Sign In
            </button>
            <span style={s.footerDivider}>·</span>
            <button className="pd-footer-link" style={s.footerLink} onClick={() => navigate('/register')}>
              Register
            </button>
            <span style={s.footerDivider}>·</span>
            <button className="pd-footer-link" style={s.footerLink} onClick={() => navigate('/admin-login')}>
              Admin
            </button>
          </div>
          <p style={s.footerCopy}>© {new Date().getFullYear()} CivicConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* ── Helpers ── */
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
  fontFamily: 'inherit',
});

/* ── Styles ── */
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
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
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
    fontFamily: 'inherit',
    transition: 'background 0.15s, border-color 0.15s',
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
    fontFamily: 'inherit',
    transition: 'opacity 0.15s, box-shadow 0.15s',
  },

  /* Hero */
  hero: {
    position: 'relative',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 45%, #7c3aed 100%)',
    padding: '80px 24px 110px',
    textAlign: 'center',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(ellipse at 30% 80%, rgba(124,58,237,0.25) 0%, transparent 60%),' +
      'radial-gradient(ellipse at 70% 20%, rgba(99,102,241,0.2) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  heroContent: { position: 'relative', maxWidth: '700px', margin: '0 auto' },
  heroBadge: {
    display: 'inline-block',
    padding: '6px 18px',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.92)',
    marginBottom: '24px',
    letterSpacing: '0.5px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  heroTitle: {
    margin: '0 0 20px',
    fontSize: 'clamp(30px, 6vw, 54px)',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.15',
    letterSpacing: '-1px',
  },
  heroSub: {
    margin: '0 auto 36px',
    fontSize: '16px',
    color: 'rgba(255,255,255,0.82)',
    lineHeight: '1.75',
    maxWidth: '540px',
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  heroPrimaryBtn: {
    padding: '14px 32px',
    background: '#fff',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
    fontFamily: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
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
    fontFamily: 'inherit',
    transition: 'background 0.2s',
  },

  /* Stats */
  statsSection: {
    maxWidth: '1200px',
    margin: '-44px auto 0',
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
    borderRadius: '18px',
    padding: '24px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  statIcon: { fontSize: '28px', marginBottom: '10px' },
  statNum:  { fontSize: '34px', fontWeight: '800', marginBottom: '4px', lineHeight: '1' },
  statLabel: { fontSize: '13px', color: '#6b7280', fontWeight: '500' },
  filterActiveDot: {
    position: 'absolute',
    bottom: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },

  /* Main */
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '52px 24px 64px',
    flex: 1,
  },
  sectionTitle: {
    margin: '0 0 4px',
    fontSize: '26px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '-0.3px',
  },
  sectionSub: { margin: 0, fontSize: '14px', color: '#6b7280' },

  /* Error state */
  errorState: {
    textAlign: 'center',
    padding: '80px 24px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },

  /* Empty state */
  emptyState: {
    textAlign: 'center',
    padding: '80px 24px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  emptyIcon:  { fontSize: '52px', marginBottom: '16px' },
  emptyTitle: { margin: '0 0 8px', fontSize: '22px', fontWeight: '700', color: '#1f2937' },
  emptySub:   { margin: '0 0 28px', fontSize: '15px', color: '#6b7280', lineHeight: '1.6' },

  /* Grid */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '18px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #f1f5f9',
  },
  cardImgWrap: {
    width: '100%',
    height: '180px',
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    flexShrink: 0,
  },
  cardImgPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)',
  },
  cardImgPlaceholderText: {
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.3s ease',
  },
  cardBody: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  categoryTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 10px',
    background: '#f0f0ff',
    color: '#6366f1',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'capitalize',
    letterSpacing: '0.3px',
  },
  cardTitle: {
    margin: '0 0 8px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: '1.45',
  },
  cardDesc: {
    margin: '0 0 12px',
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.65',
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardFooter: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px 16px',
    paddingTop: '14px',
    borderTop: '1px solid #f3f4f6',
    marginTop: 'auto',
  },
  cardInfo: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: '500',
    maxWidth: '100%',
  },
  infoIcon: { fontSize: '13px', flexShrink: 0 },

  /* Pagination */
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '48px',
    flexWrap: 'wrap',
  },
  pageNumbers: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pageNum: {
    width: '38px',
    height: '38px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    background: '#fff',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, background 0.15s',
  },
  pageNumActive: {
    width: '38px',
    height: '38px',
    border: 'none',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'default',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
  },
  pageEllipsis: { fontSize: '14px', color: '#9ca3af', alignSelf: 'center' },
  pageInfo: {
    textAlign: 'center',
    marginTop: '12px',
    fontSize: '13px',
    color: '#9ca3af',
  },

  /* Footer */
  footer: {
    backgroundColor: '#1e1b4b',
    padding: '40px 24px',
    color: '#fff',
    marginTop: 'auto',
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
  footerBrand:     { display: 'flex', alignItems: 'center', gap: '8px' },
  footerBrandText: { fontSize: '16px', fontWeight: '700' },
  footerText:      { margin: 0, fontSize: '13px', color: '#a5b4fc' },
  footerLinks:     { display: 'flex', alignItems: 'center', gap: '8px' },
  footerLink: {
    background: 'none',
    border: 'none',
    color: '#a5b4fc',
    fontSize: '13px',
    cursor: 'pointer',
    padding: 0,
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'color 0.15s',
  },
  footerDivider: { color: '#4338ca', fontSize: '13px' },
  footerCopy:    { margin: 0, fontSize: '12px', color: '#6366f1' },
};

export default PublicDashboard;
