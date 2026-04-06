import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { label: 'Submit Complaint', path: '/submit-complaint', icon: '📝' },
  { label: 'My Complaints', path: '/complaints', icon: '📋' },
  { label: 'Map View', path: '/map-view', icon: '🗺️' },
  { label: 'Search', path: '/search', icon: '🔍' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; }
  })();

  return (
    <>
      {/* Mobile overlay toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          display: 'none',
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 200,
          background: '#6d28d9',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '18px',
        }}
        className="sidebar-toggle"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <aside
        className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}
        style={{
          width: collapsed ? '0' : '240px',
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #4c1d95 0%, #6d28d9 60%, #7c3aed 100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: collapsed ? '0' : '24px 0',
          boxSizing: 'border-box',
          transition: 'width 0.25s ease',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
          zIndex: 100,
        }}
      >
        {/* Logo / Brand */}
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🏛️</span>
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px' }}>
              CivicConnect
            </span>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            marginBottom: '8px',
          }}>
            👤
          </div>
          <div style={{ color: '#e9d5ff', fontSize: '13px' }}>Logged in as</div>
          <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600' }}>
            {user.name || 'User'}
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 20px',
                  background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                  border: 'none',
                  borderLeft: active ? '4px solid #fff' : '4px solid transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                  fontSize: '15px',
                  fontWeight: active ? '600' : '400',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontSize: '18px', minWidth: '22px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '15px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
