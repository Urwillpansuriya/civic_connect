import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      if (res.data.user.role !== 'admin') {
        setModal({ show: true, title: 'Access Denied', message: 'You do not have permission to access this page.' });
        return;
      }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin');
    } catch (err) {
      setModal({
        show: true,
        title: 'Login Failed',
        message: err.response?.data?.error || err.response?.data?.message || 'Invalid credentials. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo / Icon */}
        <div style={s.iconWrap}>
          <span style={{ fontSize: '32px' }}>🏛️</span>
        </div>
        <h2 style={s.heading}>Admin Portal</h2>
        <p style={s.sub}>Sign in to manage Civic Connect</p>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={s.fieldGroup}>
            <label style={s.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              onChange={handleChange}
              required
              style={s.input}
            />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
              style={s.input}
            />
          </div>
          <button
            type="submit"
            style={loading ? { ...s.button, opacity: 0.75 } : s.button}
            disabled={loading}
          >
            {loading ? '⏳ Signing in…' : '🔑 Sign In'}
          </button>
        </form>
      </div>

      {modal.show && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>
              {modal.title === 'Access Denied' ? '🚫' : '❌'}
            </div>
            <h3 style={{ margin: '0 0 8px', color: '#1e1b4b' }}>{modal.title}</h3>
            <p style={{ margin: '0 0 20px', color: '#4b5563', fontSize: '14px' }}>{modal.message}</p>
            <button onClick={() => setModal({ ...modal, show: false })} style={s.modalBtn}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    textAlign: 'center'
  },
  iconWrap: {
    width: '68px',
    height: '68px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px'
  },
  heading: {
    margin: '0 0 6px',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e1b4b'
  },
  sub: {
    margin: '0 0 28px',
    fontSize: '14px',
    color: '#6b7280'
  },
  fieldGroup: {
    marginBottom: '16px',
    textAlign: 'left'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    fontSize: '15px',
    color: '#1f2937',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f9fafb',
    transition: 'border-color 0.2s'
  },
  button: {
    width: '100%',
    padding: '13px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'linear-gradient(90deg, #6d28d9, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'opacity 0.2s'
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

export default AdminLogin;
