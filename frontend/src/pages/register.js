// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Register() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     location: ''
//   });

//   const navigate = useNavigate();

//   const handleChange = e =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/register', formData);
//       localStorage.setItem('token', res.data.token);
//       navigate('/dashboard');
//     } catch (err) {
//       alert('Registration failed: ' + (err.response?.data?.error || err.message));
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="name" placeholder="Name" onChange={handleChange} required /><br />
//         <input name="email" placeholder="Email" onChange={handleChange} required /><br />
//         <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br />
//         <input name="location" placeholder="Location" onChange={handleChange} /><br />
//         <button type="submit">Register</button>
//       </form>
//     </div>
    
//   );
// }

// export default Register;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = "https://civic-connect-hams.onrender.com";

function Register() {
  const [modal, setModal] = useState({
  show: false,
  title: '',
  message: ''
});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: ''
  });

  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/register', formData);
//       localStorage.setItem('token', res.data.token);
//       navigate('/dashboard');
//     } catch (err) {
//       // alert('Registration failed: ' + (err.response?.data?.error || err.message));
//       setModal({
//   show: true,
//   title: 'Failed',
//   message: 'Registration failed: ' + (err.response?.data?.error || err.message)

// });

//     }
//   };
const handleSubmit = async e => {
  e.preventDefault();
  try {
    const res = await axios.post(`${API_URL}/api/auth/register`, formData);
    
    if (res.status === 201) { // Check if registration is successful
      localStorage.setItem('token', res.data.token);
      // navigate('/dashboard');
      setModal({
        show: true,
        title: 'successful',
        message: 'Registration successful: ' + res.data.message
      });
    } else {
      // Show error modal if registration fails
      setModal({
        show: true,
        title: 'Failed',
        message: 'Registration failed: ' + (res.data?.error || 'Unknown error')
      });
    }
  } catch (err) {
    // Show error modal if there's an error in the request
    setModal({
      show: true,
      title: 'Failed',
      message: 'Registration failed: ' + (err.response?.data?.error || err.message)
    });
  }
};


  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏛️</div>
        <h2 style={styles.heading}>Create an Account</h2>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 4px' }}>Join CivicConnect today</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="location"
            placeholder="Location (optional)"
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>Register</button>
        </form>

        <p style={styles.footerText}>Already have an account?</p>
        <button
          onClick={() => navigate('/login')}
          style={styles.loginButton}
        >
          Login
        </button>
      </div>
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

  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  formBox: {
    backgroundColor: 'white',
    padding: '36px 32px',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '4px',
    color: '#1e1b4b',
    fontSize: '24px',
    fontWeight: '700',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '16px',
  },
  input: {
    padding: '12px 14px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1.5px solid #ddd',
    fontSize: '15px',
    color: '#1e1b4b',
    outline: 'none',
  },
  submitButton: {
    padding: '12px',
    background: 'linear-gradient(90deg, #6d28d9, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  footerText: {
    marginTop: '14px',
    fontSize: '13px',
    textAlign: 'center',
    color: '#6b7280',
  },
  loginButton: {
    marginTop: '6px',
    width: '100%',
    padding: '11px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
  },
};

export default Register;
