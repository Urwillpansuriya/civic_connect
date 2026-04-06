// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function PublicDashboard() {
//   const [complaints, setComplaints] = useState([]);

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/complaints');
//         setComplaints(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error('Error fetching complaints:', err);
//         alert('Failed to load complaints');
//       }
//     };

//     fetchComplaints();
//   }, []);

//   const cardStyle = {
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     padding: '15px',
//     marginTop: '15px',
//     backgroundColor: '#f9f9f9'
//   };

//   const imageStyle = {
//     width: '200px',
//     marginTop: '10px',
//     borderRadius: '6px',
//     border: '1px solid #ddd'
//   };

//   return (
//     <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
//       <h2>🗺️ Public Complaint Dashboard</h2>

//       {complaints.length === 0 ? (
//         <p>No complaints available.</p>
//       ) : (
//         complaints.map(c => (
//           <div key={c._id} style={cardStyle}>
//             <h4>{c.title}</h4>
//             <p>{c.description}</p>
//             <p><strong>User:</strong> {c.user?.name || 'Anonymous'}</p>
//             <p><strong>Location:</strong> {c.location}</p>
//             <p><strong>Status:</strong> {c.status}</p>
//             {c.imageUrl && (
//               <img
//                 src={`http://localhost:5000/uploads/${c.imageUrl}`}
//                 alt="complaint"
//                 style={imageStyle}
//               />
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// export default PublicDashboard;


















// import React, { useEffect, useState } from 'react';
// import axios from 'axios';


// function PublicDashboard() {
//   const [complaints, setComplaints] = useState([]);

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/complaints');
//         setComplaints(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error('Error fetching complaints:', err);
//         alert('Failed to load complaints');
//       }
//     };

//     fetchComplaints();
//   }, []);

//   // 🌟 Internal CSS styles
//   const styles = {
//     container: {
//       padding: '40px 20px',
//       fontFamily: 'Segoe UI, sans-serif',
//       maxWidth: '1100px',
//       margin: '0 auto',
//     },
//     heading: {
//       fontSize: '28px',
//       color: '#333',
//       marginBottom: '25px',
//       textAlign: 'center',
//     },
//     card: {
//       border: '1px solid #e0e0e0',
//       borderRadius: '10px',
//       padding: '20px',
//       marginBottom: '20px',
//       backgroundColor: '#ffffff',
//       boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
//       transition: 'transform 0.2s ease-in-out',
//     },
//     cardHover: {
//       transform: 'scale(1.02)',
//     },
//     title: {
//       fontSize: '20px',
//       fontWeight: '600',
//       color: '#2c3e50',
//     },
//     paragraph: {
//       fontSize: '16px',
//       color: '#555',
//       margin: '5px 0',
//     },
//     label: {
//       fontWeight: 'bold',
//       color: '#222',
//     },
//     image: {
//       width: '100%',
//       maxWidth: '300px',
//       marginTop: '10px',
//       borderRadius: '8px',
//       border: '1px solid #ddd',
//     },
//     noData: {
//       textAlign: 'center',
//       color: '#777',
//       fontStyle: 'italic',
//       marginTop: '20px',
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>🗺️ Public Complaint Dashboard</h2>

//       {complaints.length === 0 ? (
//         <p style={styles.noData}>No complaints available.</p>
//       ) : (
//         complaints.map(c => (
//           <div key={c._id} style={styles.card}>
//             <h4 style={styles.title}>{c.title}</h4>
//             <p style={styles.paragraph}>{c.description}</p>
//             <p style={styles.paragraph}><span style={styles.label}>User:</span> {c.user?.name || 'Anonymous'}</p>
//             <p style={styles.paragraph}><span style={styles.label}>Location:</span> {c.location}</p>
//             <p style={styles.paragraph}><span style={styles.label}>Status:</span> {c.status}</p>
//             {c.imageUrl && (
//               <img
//                 src={`http://localhost:5000/uploads/${c.imageUrl}`}
//                 alt="complaint"
//                 style={styles.image}
//               />
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// export default PublicDashboard;












import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PublicDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, [currentPage]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/complaints?page=${currentPage}&limit=10`);

      if (res.data.complaints) {
        setComplaints(res.data.complaints);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setComplaints(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
      alert('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const styles = {
    container: {
      padding: '40px 20px',
      fontFamily: 'Segoe UI, sans-serif',
      maxWidth: '1100px',
      margin: '0 auto',
    },
    heading: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '25px',
      textAlign: 'center',
    },
    navButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginBottom: '20px',
    },
    btn: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: 'bold',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    card: {
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2c3e50',
    },
    paragraph: {
      fontSize: '16px',
      color: '#555',
      margin: '5px 0',
    },
    label: {
      fontWeight: 'bold',
      color: '#222',
    },
    image: {
      width: '100%',
      maxWidth: '300px',
      marginTop: '10px',
      borderRadius: '8px',
      border: '1px solid #ddd',
    },
    noData: {
      textAlign: 'center',
      color: '#777',
      fontStyle: 'italic',
      marginTop: '20px',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '20px',
      gap: '10px'
    },
    paginationButton: (isDisabled) => ({
      padding: '8px 16px',
      backgroundColor: isDisabled ? '#ccc' : '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: isDisabled ? 'not-allowed' : 'pointer'
    }),
    loading: {
      textAlign: 'center',
      margin: '20px 0',
      fontSize: '16px',
      color: '#555'
    }
  };

  return (
    <div style={styles.container}>
      {/* Register/Login buttons */}
      <div style={styles.navButtons}>
        <button style={styles.btn} onClick={() => navigate('/login')}>Login</button>
        <button style={styles.btn} onClick={() => navigate('/')}>Register</button>
      </div>

      <h2 style={styles.heading}>🗺️ Public Complaint Dashboard</h2>

      {loading ? (
        <p style={styles.loading}>Loading complaints...</p>
      ) : (
        <>
          {complaints.length === 0 ? (
            <p style={styles.noData}>No complaints available.</p>
          ) : (
            complaints.map(c => (
              <div key={c._id} style={styles.card}>
                <h4 style={styles.title}>{c.title}</h4>
                <p style={styles.paragraph}>{c.description}</p>
                <p style={styles.paragraph}><span style={styles.label}>User:</span> {c.user?.name || 'Anonymous'}</p>
                <p style={styles.paragraph}><span style={styles.label}>Location:</span> {c.location}</p>
                <p style={styles.paragraph}><span style={styles.label}>Status:</span> {c.status}</p>
                {c.imageUrl && (
                  <img
                    src={`http://localhost:5000/uploads/${c.imageUrl}`}
                    alt="complaint"
                    style={styles.image}
                  />
                )}
              </div>
            ))
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={styles.paginationButton(currentPage === 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={styles.paginationButton(currentPage === totalPages)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PublicDashboard;
