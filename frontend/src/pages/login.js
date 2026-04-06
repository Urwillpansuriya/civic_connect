// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data.user));

//       if (res.data.user.role === 'admin') {
//         navigate('/admin');
//       } else {
//         navigate('/dashboard');
//       }

//     } catch (err) {
//       alert(err.response?.data?.error || 'Login failed');
//     }
//   };

//   const containerStyle = {
//     maxWidth: '400px',
//     margin: '60px auto',
//     padding: '30px',
//     border: '1px solid #ccc',
//     borderRadius: '10px',
//     boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
//     backgroundColor: '#f9f9f9',
//     fontFamily: 'Arial, sans-serif'
//   };

//   const inputStyle = {
//     width: '100%',
//     padding: '10px',
//     margin: '10px 0',
//     borderRadius: '5px',
//     border: '1px solid #aaa',
//     fontSize: '16px'
//   };

//   const buttonStyle = {
//     width: '100%',
//     padding: '10px',
//     marginTop: '10px',
//     backgroundColor: '#007bff',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontSize: '16px'
//   };

//   const secondaryButtonStyle = {
//     ...buttonStyle,
//     backgroundColor: '#6c757d',
//     marginTop: '8px'
//   };

//   const headingStyle = {
//     textAlign: 'center',
//     marginBottom: '20px'
//   };

//   return (
//     <div style={containerStyle}>
//       <h2 style={headingStyle}>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//           style={inputStyle}
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//           style={inputStyle}
//         />
//         <button type="submit" style={buttonStyle}>Login</button>
//       </form>

//       <p style={{ textAlign: 'center', marginTop: '15px' }}>
//         Don't have an account?
//       </p>
//       <button onClick={() => navigate('/')} style={secondaryButtonStyle}>
//         Register
//       </button>
//     </div>
//   );
// }

// export default Login;







import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = "https://civic-connect-hams.onrender.com";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: ''
  });

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
      // alert(err.response?.data?.error || 'Login failed');
  setModal({
  show: true,
  title: 'Failed',
  message: (err.response?.data?.error || 'Login failed')
});

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

  const buttonStyle = {
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
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
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

export default Login;
