import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = "https://civic-connect-hams.onrender.com";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: '', message: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setModal({ show: true, title: 'Login Failed', message: err.response?.data?.error || 'Login failed' });
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '400px',
    background: '#fff',
    borderRadius: '16px',
    padding: '36px 32px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    textAlign: 'center',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    margin: '8px 0',
    borderRadius: '8px',
    border: '1.5px solid #ddd',
    fontSize: '15px',
    backgroundColor: '#fff',
    color: '#1e1b4b',
    boxSizing: 'border-box',
    outline: 'none',
  };
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <div style={styles.iconWrap}>
            <span style={{ fontSize: '28px' }}>🏛️</span>
          </div>
          <h1 style={styles.appName}>CivicConnect</h1>
          <p style={styles.tagline}>Your voice for a better community</p>
        </div>

        {/* Form */}
        <div style={styles.cardBody}>
          <h2 style={styles.heading}>Welcome Back</h2>
          <p style={styles.subheading}>Sign in to your account</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.primaryBtn}>Sign In</button>
          </form>

          <div style={styles.divider}><span style={styles.dividerText}>New to CivicConnect?</span></div>
          <button onClick={() => navigate('/')} style={styles.secondaryBtn}>Create Account</button>

          <p style={styles.adminLink}>
            Are you an admin?{' '}
            <span onClick={() => navigate('/admin-login')} style={styles.adminLinkText}>Admin Login →</span>
          </p>
        </div>
      </div>

      {/* Modal */}
      {modal.show && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>❌</div>
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
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    boxSizing: 'border-box'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    background: 'linear-gradient(90deg, #6d28d9, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: '#6b7280',
  };

  const headingStyle = {
    marginBottom: '6px',
    fontSize: '24px',
    color: '#1e1b4b',
    fontWeight: '700',
  };

  const infoTextStyle = {
    fontSize: '13px',
    marginTop: '12px',
    color: '#6b7280',
  };

  return (
    <div style={pageStyle}>
    <div style={containerStyle}>
      <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏛️</div>
      <h2 style={headingStyle}>Welcome Back</h2>
      <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 20px' }}>
        Sign in to CivicConnect
      </p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          style={inputStyle}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>

      <p style={infoTextStyle}>Don't have an account?</p>
      <button onClick={() => navigate('/')} style={secondaryButtonStyle}>Register</button>

      <p style={infoTextStyle}>Are you an admin?</p>
      <button onClick={() => navigate('/admin-login')} style={secondaryButtonStyle}>Admin Login</button>
    {modal.show && (
  <div style={{
    maxWidth: '440px',
    overflow: 'hidden'
  },
  cardHeader: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    padding: '32px 40px 24px',
    textAlign: 'center',
    color: '#fff'
  },
  iconWrap: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.2)',
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
    opacity: 0.85
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
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    boxShadow: '0 4px 15px rgba(79,70,229,0.35)'
  },
  divider: {
    textAlign: 'center',
    margin: '20px 0 12px',
    position: 'relative'
  },
  dividerText: {
    fontSize: '13px',
    color: '#9ca3af',
    backgroundColor: '#fff',
    padding: '0 8px'
  },
  secondaryBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  adminLink: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '13px',
    color: '#9ca3af'
  },
  adminLinkText: {
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
  }}>
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      width: '300px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      textAlign: 'center'
    }}>
      <h3>{modal.title}</h3>
      <p>{modal.message}</p>
      <button onClick={() => setModal({ ...modal, show: false })} style={{
        marginTop: '10px',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '5px',
        background: '#6d28d9',
        color: '#fff',
        cursor: 'pointer'
      }}>
        OK
      </button>
    </div>
  </div>
)}

    </div>
    </div>
    
  );
}
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
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default Login;
