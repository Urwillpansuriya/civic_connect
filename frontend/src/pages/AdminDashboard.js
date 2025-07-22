// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { getToken } from '../utils/auth';


// function AdminDashboard() {
//   const [complaints, setComplaints] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/complaints/all', {
//       headers: { Authorization: `Bearer ${getToken()}` }
//     }).then(res => setComplaints(res.data));
//   }, []);

//   const updateStatus = async (id, status) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/complaints/status/${id}`, { status }, {
//         headers: { Authorization: `Bearer ${getToken()}` }
//       });
//       alert(`Status updated to "${status}"`);
//       const updated = complaints.map(c => c._id === id ? { ...c, status } : c);
//       setComplaints(updated);
//     } catch (err) {
//       alert('Failed to update status');
//     }
//   };

//   // ---------- Styling ----------
//   const containerStyle = {
//     maxWidth: '900px',
//     margin: '30px auto',
//     padding: '20px',
//     fontFamily: 'Arial, sans-serif',
//   };

//   const cardStyle = {
//     border: '1px solid #ddd',
//     borderRadius: '8px',
//     padding: '16px',
//     marginBottom: '20px',
//     boxShadow: '0 0 10px rgba(0,0,0,0.05)',
//     backgroundColor: '#fff'
//   };

//   const titleStyle = {
//     fontSize: '18px',
//     marginBottom: '8px',
//     color: '#333',
//   };

//   const buttonStyle = {
//     padding: '8px 12px',
//     marginRight: '8px',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontWeight: 'bold'
//   };

//   const statusStyles = {
//     pending: { backgroundColor: '#ffc107', color: '#000' },
//     'in-progress': { backgroundColor: '#17a2b8', color: '#fff' },
//     resolved: { backgroundColor: '#28a745', color: '#fff' }
//   };

//   return (
//     <div style={containerStyle}>
//       <h2>Admin Complaint Dashboard</h2>

//       {complaints.map(c => (
//         <div key={c._id} style={cardStyle}>
//           <h4 style={titleStyle}>{c.title}</h4>
//           <p>{c.description}</p>
//           <p><strong>Status:</strong> {c.status}</p>

//           <button
//             onClick={() => updateStatus(c._id, 'pending')}
//             style={{ ...buttonStyle, ...statusStyles['pending'] }}
//           >
//             Mark as Pending
//           </button>
//           <button
//             onClick={() => updateStatus(c._id, 'in-progress')}
//             style={{ ...buttonStyle, ...statusStyles['in-progress'] }}
//           >
//             Mark as In Progress
//           </button>
//           <button
//             onClick={() => updateStatus(c._id, 'resolved')}
//             style={{ ...buttonStyle, ...statusStyles['resolved'] }}
//           >
//             Mark as Resolved
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default AdminDashboard;




















// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { getToken } from '../utils/auth';
// import AddCategory from './AddCategory';

// function AdminDashboard() {
//   const [complaints, setComplaints] = useState([]);
  

//   // 🔄 Fetch all complaints on mount
//   useEffect(() => {
//     axios.get('http://localhost:5000/api/complaints/all', {
//       headers: { Authorization: `Bearer ${getToken()}` }
//     }).then(res => setComplaints(res.data));
//   }, []);

//   // ✅ Update complaint status
//   const updateStatus = async (id, status) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/complaints/status/${id}`, { status }, {
//         headers: { Authorization: `Bearer ${getToken()}` }
//       });
//       alert(`Status updated to "${status}"`);
//       const updated = complaints.map(c => c._id === id ? { ...c, status } : c);
//       setComplaints(updated);
//     } catch (err) {
//       alert('Failed to update status');
//     }
//   };

//   // ✅ Add new category

//   // 💅 Styling
//   const containerStyle = {
//     maxWidth: '900px',
//     margin: '30px auto',
//     padding: '20px',
//     fontFamily: 'Arial, sans-serif',
//   };

//   const cardStyle = {
//     border: '1px solid #ddd',
//     borderRadius: '8px',
//     padding: '16px',
//     marginBottom: '20px',
//     boxShadow: '0 0 10px rgba(0,0,0,0.05)',
//     backgroundColor: '#fff'
//   };

//   const titleStyle = {
//     fontSize: '18px',
//     marginBottom: '8px',
//     color: '#333',
//   };

//   const buttonStyle = {
//     padding: '8px 12px',
//     marginRight: '8px',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontWeight: 'bold'
//   };

//   const statusStyles = {
//     pending: { backgroundColor: '#ffc107', color: '#000' },
//     'in-progress': { backgroundColor: '#17a2b8', color: '#fff' },
//     resolved: { backgroundColor: '#28a745', color: '#fff' }
//   };

//   return (
//     <div style={containerStyle}>
//       <h2>🧑‍💼 Admin Complaint Dashboard</h2>
//       <AddCategory />
//       {complaints.map(c => (
//         <div key={c._id} style={cardStyle}>
//           <h4 style={titleStyle}>{c.title}</h4>
//           <p>{c.description}</p>
//           <p><strong>Status:</strong> {c.status}</p>

//           <button
//             onClick={() => updateStatus(c._id, 'pending')}
//             style={{ ...buttonStyle, ...statusStyles['pending'] }}
//           >
//             Mark as Pending
//           </button>
//           <button
//             onClick={() => updateStatus(c._id, 'in-progress')}
//             style={{ ...buttonStyle, ...statusStyles['in-progress'] }}
//           >
//             Mark as In Progress
//           </button>
//           <button
//             onClick={() => updateStatus(c._id, 'resolved')}
//             style={{ ...buttonStyle, ...statusStyles['resolved'] }}
//           >
//             Mark as Resolved
//           </button>
//         </div>
//       ))}

      
//     </div>
//   );
// }

// export default AdminDashboard;








import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import AddCategory from './AddCategory';

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/complaints/all', {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(res => setComplaints(res.data.complaints || []));
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '20px' }}>
      <h2>🧑‍💼 Admin Complaint Dashboard</h2>
      <AddCategory />
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Title</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>User</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(c => (
            <tr key={c._id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{c.title}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{c.description}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{c.category}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{c.status}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{c.user?.name || c.createdBy?.name || 'Unknown'}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <button
                  onClick={() => navigate(`/admin/complaints/${c._id}`)}
                  style={{
                    padding: '6px 12px',
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Change Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;