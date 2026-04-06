// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { getToken } from '../utils/auth';
// import { useNavigate } from 'react-router-dom';
// import AddCategory from './AddCategory';

// function AdminDashboard() {
//   const [complaints, setComplaints] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const navigate = useNavigate();

//   const fetchData = async (page) => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/complaints/all?page=${page}&limit=10`, {
//         headers: { Authorization: `Bearer ${getToken()}` }
//       });
//       setComplaints(res.data.complaints || []);
//       setTotalPages(res.data.totalPages || 1);
//       setSummary(res.data); // assuming summary info is included
//     } catch (err) {
//       console.error('Error fetching complaints:', err);
//     }
//   };

//   useEffect(() => {
//     fetchData(currentPage);
//   }, [currentPage]);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const filteredComplaints = complaints.filter((c) =>
//     c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     c.location?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '20px' }}>
//       <h2>🧑‍💼 Admin Complaint Dashboard</h2>

//       {/* Summary Cards (optional - use if you already set summary data) */}
//       {summary && (
//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '30px', gap: '20px' }}>
//           {/* Replace with your summary cards */}
//         </div>
//       )}

//       <AddCategory />

//       <div style={{ marginTop: '40px', marginBottom: '10px' }}>
//         <input
//           type="text"
//           placeholder="Search by title or location..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             padding: '10px',
//             width: '100%',
//             fontSize: '16px',
//             borderRadius: '6px',
//             border: '1px solid #ccc'
//           }}
//         />
//       </div>

//       <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px' }}>
//         <thead>
//           <tr style={{ background: '#f0f0f0' }}>
//             <th style={thStyle}>Title</th>
//             <th style={thStyle}>Description</th>
//             <th style={thStyle}>Category</th>
//             <th style={thStyle}>Status</th>
//             <th style={thStyle}>User</th>
//             <th style={thStyle}>Date</th>
//             <th style={thStyle}>💬 Comments</th>
//             <th style={thStyle}>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredComplaints.map(c => (
//             <tr key={c._id}>
//               <td style={tdStyle}>{c.title}</td>
//               <td style={tdStyle}>{c.description}</td>
//               <td style={tdStyle}>{c.category}</td>
//               <td style={tdStyle}>
            //   <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            //     <span style={{
            //       display: 'inline-block',
            //       padding: '4px 8px',
            //       borderRadius: '4px',
            //       backgroundColor: getStatusColor(c.status),
            //       color: '#fff',
            //       marginBottom: '5px'
            //     }}>
            //       {c.status}
            //     </span>
            //     <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            //       <button
            //         onClick={() => updateStatus(c._id, 'pending')}
            //         style={{
            //           padding: '2px 5px',
            //           fontSize: '12px',
            //           backgroundColor: c.status === 'pending' ? '#ffc107' : '#f8f9fa',
            //           color: c.status === 'pending' ? '#fff' : '#000',
            //           border: '1px solid #ddd',
            //           borderRadius: '3px',
            //           cursor: 'pointer'
            //         }}
            //       >
            //         Pending
            //       </button>
            //       <button
            //         onClick={() => updateStatus(c._id, 'in-progress')}
            //         style={{
            //           padding: '2px 5px',
            //           fontSize: '12px',
            //           backgroundColor: c.status === 'in-progress' ? '#17a2b8' : '#f8f9fa',
            //           color: c.status === 'in-progress' ? '#fff' : '#000',
            //           border: '1px solid #ddd',
            //           borderRadius: '3px',
            //           cursor: 'pointer'
            //         }}
            //       >
            //         In Progress
            //       </button>
            //       <button
            //         onClick={() => updateStatus(c._id, 'resolved')}
            //         style={{
            //           padding: '2px 5px',
            //           fontSize: '12px',
            //           backgroundColor: c.status === 'resolved' ? '#28a745' : '#f8f9fa',
            //           color: c.status === 'resolved' ? '#fff' : '#000',
            //           border: '1px solid #ddd',
            //           borderRadius: '3px',
            //           cursor: 'pointer'
            //         }}
            //       >
            //         Resolved
            //       </button>
            //       <button
            //         onClick={() => updateStatus(c._id, 'rejected')}
            //         style={{
            //           padding: '2px 5px',
            //           fontSize: '12px',
            //           backgroundColor: c.status === 'rejected' ? '#dc3545' : '#f8f9fa',
            //           color: c.status === 'rejected' ? '#fff' : '#000',
            //           border: '1px solid #ddd',
            //           borderRadius: '3px',
            //           cursor: 'pointer'
            //         }}
            //       >
            //         Rejected
            //       </button>
            //     </div>
            //   </div>
            // </td>
//               <td style={tdStyle}>{c.user?.name || c.createdBy?.name || 'Unknown'}</td>
//               <td style={tdStyle}>{new Date(c.createdAt).toLocaleDateString()}</td>
//               <td style={tdStyle}>{c.commentCount || (c.comments?.length ?? 0)}</td>
//               <td style={tdStyle}>
//                 <button
//                   onClick={() => navigate(`/admin/complaints/${c._id}`)}
//                   style={{
//                     padding: '6px 12px',
//                     background: '#007bff',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   Change Status
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div style={{ marginTop: '20px', textAlign: 'center' }}>
//           <button 
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             style={paginationButtonStyle(currentPage === 1)}
//           >
//             Previous
//           </button>

//           <span style={{ margin: '0 10px' }}>
//             Page {currentPage} of {totalPages}
//           </span>

//           <button 
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             style={paginationButtonStyle(currentPage === totalPages)}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// const thStyle = { border: '1px solid #ccc', padding: '8px' };
// const tdStyle = { border: '1px solid #ccc', padding: '8px' };

// const paginationButtonStyle = (disabled) => ({
//   padding: '8px 16px',
//   margin: '0 5px',
//   border: 'none',
//   borderRadius: '4px',
//   backgroundColor: disabled ? '#ccc' : '#007bff',
//   color: 'white',
//   cursor: disabled ? 'not-allowed' : 'pointer'
// });

// export default AdminDashboard;















import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import AddCategory from './AddCategory';
import AdminCharts from '../components/AdminCharts';
import CommentSection from '../components/CommentSection';
import Modal from '../components/Modal';
const API_URL = process.env.REACT_APP_API_URL || "https://civic-connect-hams.onrender.com";
function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: ''
  });
  const navigate = useNavigate();

  const fetchData = async (page) => {
    try {
      const res = await axios.get(`${API_URL}/api/complaints/all?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      // Ensure each complaint has commentCount initialized
      const complaintsWithCounts = (res.data.complaints || []).map(complaint => ({
        ...complaint,
        commentCount: complaint.commentCount || 0,
        likeCount: complaint.likes ? complaint.likes.length : 0
      }));
      
      setComplaints(complaintsWithCounts);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || 1);
      setSummary({
        totalUsers: res.data.totalUsers || 0,
        statusCounts: res.data.statusCounts || {}
      });
      
      console.log('Dashboard data:', res.data); // Debug data
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/api/complaints/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        // Remove the deleted complaint from the state
        setComplaints(complaints.filter(c => c._id !== id));
        
        setModal({
          show: true,
          title: 'Success',
          message: 'Complaint deleted successfully!'
        });
      } catch (err) {
        console.error('Error deleting complaint:', err);
        setModal({
          show: true,
          title: 'Error',
          message: 'Failed to delete complaint. Please try again.'
        });
      }
    }
  };
  

  
  const toggleComments = (complaintId) => {
    if (selectedComplaintId === complaintId && showComments) {
      setShowComments(false);
      setSelectedComplaintId(null);
    } else {
      setSelectedComplaintId(complaintId);
      setShowComments(true);
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'in-progress': return '#17a2b8';
      case 'resolved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredComplaints = complaints.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '20px' }}>
    {/* 🔹 Header Row: Title + Add Category */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
      gap: '20px',
      marginBottom: '30px'
    }}>
      <h2 style={{ margin: 0, whiteSpace: 'nowrap' }}>🧑‍💼 Admin Complaint Dashboard</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexGrow: 1,
    justifyContent: 'flex-end',
    marginLeft: '-80px',
    flexWrap: 'nowrap' }}>
        <AddCategory />
        
      </div>
    </div>

    {/* 🔹 Summary Cards */}
    <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={cardStyle('#f39c12')}>
          <h4>Total Users</h4>
          <h2>{summary?.totalUsers || 0}</h2>
          
        </div>

        <div style={cardStyle('#16a085')}>
          <h4>Total Complaints</h4>
          <h2>{summary?.statusCounts ? Object.values(summary.statusCounts).reduce((a, b) => a + b, 0) : 0}</h2>
        </div>

        <div style={cardStyle('#e74c3c')}>
          <h4>Pending Complaints</h4>
          <h2>{summary?.statusCounts?.pending || 0}</h2>
        </div>

        <div style={cardStyle('#3498db')}>
          <h4>Resolved Complaints</h4>
          <h2>{summary?.statusCounts?.resolved || 0}</h2>
        </div>
      </div>
      {/* 🔹 Real-time Analytics Charts */}
        <AdminCharts />
        <h3 style={{ marginBottom: '8px' }}>Search Complaints</h3>
    <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #000',
            fontSize: '14px',
            Width: '240px',
            flexShrink: 0
          }}
        />
    {/* 🔹 Complaints Table */}
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px' }}>
      <thead>
        <tr style={{ background: '#f0f0f0' }}>
          <th style={thStyle}>Title</th>
          <th style={thStyle}>Description</th>
          <th style={thStyle}>Category</th>
          <th style={thStyle}>Status</th>
          <th style={thStyle}>User</th>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>💬 Comments</th>
          <th style={thStyle}>👍 Likes</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredComplaints.map(c => (
          <React.Fragment key={c._id}>
            <tr>
              <td style={tdStyle}>{c.title}</td>
              <td style={tdStyle}>{c.description}</td>
              <td style={tdStyle}>{c.category}</td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getStatusColor(c.status),
                    color: '#fff',
                    marginBottom: '5px'
                  }}>
                    {c.status}
                  </span>
                </div>
              </td>
              <td style={tdStyle}>{c.user?.name || c.createdBy?.name || 'Unknown'}</td>
              <td style={tdStyle}>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td style={tdStyle}>
                <button 
                  onClick={() => toggleComments(c._id)}
                  style={{
                    padding: '6px 12px',
                    background: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                >
                  {c.commentCount || 0} Comments
                </button>
              </td>
              <td style={tdStyle}>{c.likeCount || 0}</td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: '5px' }}>
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
                  <button
                    onClick={() => handleDeleteComplaint(c._id)}
                    style={{
                      padding: '6px 12px',
                      background: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            {selectedComplaintId === c._id && showComments && (
              <tr>
                <td colSpan="9" style={{ ...tdStyle, backgroundColor: '#f8f9fa' }}>
                  <CommentSection complaintId={c._id} />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>

    {/* 🔹 Pagination */}
    {totalPages > 1 && (
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={paginationButtonStyle(currentPage === 1)}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={paginationButtonStyle(currentPage === totalPages)}
        >
          Next
        </button>
      </div>
    )}
    
    <Modal
      show={modal.show}
      title={modal.title}
      message={modal.message}
      onClose={() => setModal({ ...modal, show: false })}
    />
  </div>
);
}

const thStyle = { border: '1px solid #ccc', padding: '8px' };
const tdStyle = { border: '1px solid #ccc', padding: '8px' };

// Remove this comment as it's unnecessary and might cause confusion

const cardStyle = (bgColor) => ({
  flex: '1',
  minWidth: '220px',
  backgroundColor: bgColor,
  color: '#fff',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
});

const paginationButtonStyle = (disabled) => ({
  padding: '8px 16px',
  margin: '0 5px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: disabled ? '#ccc' : '#007bff',
  color: 'white',
  cursor: disabled ? 'not-allowed' : 'pointer'
});

export default AdminDashboard;