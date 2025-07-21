// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function AdminLogin() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', form);
//       console.log('Full response:', res.data);
//       if (res.data.user.role !== 'admin') {
//         console.log('Logged-in role:', res.data.user.role);
//         alert('Access denied. Not an admin.');
//         return;
//       }
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data.user));
//       navigate('/admin');
//     } catch (err) {
//       alert('Invalid credentials');
//     }
//   };

//   return (
//     <div>
//       <h2>Admin Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="email" name="email" placeholder="Admin Email" onChange={handleChange} required />
//         <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default AdminLogin;







import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      if (res.data.user.role !== 'admin') {
        alert('Access denied. Not an admin.');
        return;
      }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  // 🌟 Updated Internal CSS
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '80px auto',
      padding: '30px 25px',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
    },
    heading: {
      textAlign: 'center',
      fontSize: '24px',
      marginBottom: '25px',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '16px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
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
        <button
          type="submit"
          style={styles.button}
          onMouseOver={e => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={e => e.target.style.backgroundColor = '#007bff'}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
