import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setModal({ show: true, title: 'Login Failed', message: err.response?.data?.error || 'Invalid credentials' });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <div style={styles.iconWrap}>
            <span style={{ fontSize: '28px' }}>🛡️</span>
          </div>
          <h1 style={styles.appName}>CivicConnect</h1>
          <p style={styles.tagline}>Admin Portal</p>
        </div>

        {/* Form */}
        <div style={styles.cardBody}>
          <h2 style={styles.heading}>Admin Login</h2>
          <p style={styles.subheading}>Sign in with your admin credentials</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Admin email"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.primaryBtn}>Sign In as Admin</button>
          </form>

          <p style={styles.backLink}>
            <span onClick={() => navigate('/login')} style={styles.backLinkText}>← Back to User Login</span>
          </p>
          <p style={{ ...styles.backLink, marginTop: '6px' }}>
            <span onClick={() => navigate('/')} style={{ ...styles.backLinkText, color: '#9ca3af', fontWeight: '500' }}>
              🌐 View Public Dashboard
            </span>
          </p>
        </div>
      </div>

      {/* Modal */}
      {modal.show && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>
              {modal.title === 'Access Denied' ? '🚫' : '❌'}
            </div>
            <h3 style={{ margin: '0 0 8px', color: '#1f2937' }}>{modal.title}</h3>
            <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: '14px' }}>{modal.message}</p>
            <button onClick={() => setModal({ ...modal, show: false })} style={styles.modalBtn}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
    width: '100%',
    maxWidth: '420px',
    overflow: 'hidden'
  },
  cardHeader: {
    background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)',
    padding: '32px 40px 24px',
    textAlign: 'center',
    color: '#fff'
  },
  iconWrap: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px'
  },
  appName: {
    margin: '0 0 4px',
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.3px'
  },
  tagline: {
    margin: 0,
    fontSize: '13px',
    opacity: 0.85,
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  cardBody: {
    padding: '32px 40px 36px'
  },
  heading: {
    margin: '0 0 4px',
    fontSize: '22px',
    fontWeight: '700',
    color: '#1f2937'
  },
  subheading: {
    margin: '0 0 24px',
    fontSize: '14px',
    color: '#6b7280'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '14px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  },
  input: {
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    fontSize: '15px',
    color: '#1f2937',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    width: '100%',
    backgroundColor: '#fff'
  },
  primaryBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    boxShadow: '0 4px 15px rgba(30,27,75,0.35)'
  },
  backLink: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '13px',
    color: '#9ca3af'
  },
  backLinkText: {
    color: '#4f46e5',
    fontWeight: '600',
    cursor: 'pointer'
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default AdminLogin;
