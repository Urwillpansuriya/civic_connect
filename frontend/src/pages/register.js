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

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      // alert('Registration failed: ' + (err.response?.data?.error || err.message));
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
        <h2 style={styles.heading}>Create an Account</h2>
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
        background: '#007bff',
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
    backgroundColor: '#f3f4f6',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formBox: {
    backgroundColor: 'white',
    padding: '30px 40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#1f2937'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  submitButton: {
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer'
  },
  footerText: {
    marginTop: '15px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#555'
  },
  loginButton: {
    marginTop: '10px',
    width: '100%',
    padding: '10px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Register;
