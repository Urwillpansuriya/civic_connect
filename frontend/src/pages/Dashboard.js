import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isAuthenticated } from '../utils/auth';
import axios from 'axios';
import LikeButton from '../components/LikeButton';
import CommentSection from '../components/CommentSection';

function Dashboard() {
  const [user, setUser] = useState({ name: '', email: '', location: '' });
  const [userComplaints, setUserComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUser(savedUser);

    const fetchData = async () => {
      try {
        const [userRes, allRes] = await Promise.all([
          axios.get('http://localhost:5000/api/complaints/mine', {
            headers: { Authorization: `Bearer ${getToken()}` }
          }),
          axios.get('http://localhost:5000/api/complaints/all', {
            headers: { Authorization: `Bearer ${getToken()}` }
          })
        ]);
        setUserComplaints(userRes.data);
        setAllComplaints(Array.isArray(allRes.data) ? allRes.data : allRes.data.complaints || []);
      } catch (err) {
        console.error('❌ Fetch error:', err);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };


  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '15px',
    backgroundColor: '#f9f9f9'
  };

  const imageStyle = {
    width: '200px',
    marginTop: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd'
  };

  const filteredComplaints = allComplaints.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Welcome, {user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      {/* <p><strong>Location:</strong> {user.location}</p> */}

      <div style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px', border: 'none', borderRadius: '5px' }}>Logout</button>
        <button onClick={() => navigate('/submit-complaint')} style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', border: 'none', borderRadius: '5px' }}>Add Complaint</button>
        <button onClick={() => navigate('/map-view')} style={{ backgroundColor: '#198754', color: '#fff', padding: '10px', border: 'none', borderRadius: '5px' }}>View Map</button>
      </div>

      {/* User's Complaints */}
      {userComplaints.map(c => (
        <div key={c._id} style={cardStyle}>
          <h4>{c.title}</h4>
          <p><strong>Description:</strong> {c.description}</p>
          <p><strong>Category:</strong> {c.category}</p>
          <p><strong>Place:</strong> {c.placeName}</p>
          <p><strong>Area:</strong> {c.areaName}</p>
          <p><strong>City:</strong> {c.cityName}</p>
          <p><strong>Location:</strong>{c.location}</p>
          <p><strong>Coordinates:</strong> {c.lat}, {c.lng}</p>
          <p><strong>Status:</strong> <span className={`status-badge ${c.status}`}>{c.status}</span></p>
          <p><strong>Date:</strong> {new Date(c.createdAt).toLocaleDateString()}</p>
          {c.imageUrl && (
            <img src={`http://localhost:5000/uploads/${c.imageUrl}`} alt="complaint" style={imageStyle} />
          )}
          <LikeButton complaintId={c._id} initialLikes={c.likes || 0} />
        </div>
      ))}

      {/* 🔍 Search Bar */}
      <div style={{ marginTop: '40px', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* All Complaints */}
      <h3 style={{ marginTop: '20px' }}>All Registered Complaints</h3>
      {filteredComplaints.length === 0 ? (
        <p>No complaints match your search.</p>
      ) : (
        filteredComplaints.map(c => (
          <div key={c._id} style={cardStyle}>
            <h4>{c.title}</h4>
            <p>{c.description}</p>
            <p><strong>User:</strong> {c.user?.name || 'Unknown'}</p>
            <p><strong>Place:</strong> {c.placeName}</p>
            <p><strong>Area:</strong> {c.areaName}</p>
            <p><strong>City:</strong> {c.cityName}</p>
            <p><strong>Location:</strong> {c.location}</p>
            <p><strong>Status:</strong> {c.status}</p>
            {c.imageUrl && (
              <img src={`http://localhost:5000/uploads/${c.imageUrl}`} alt="complaint" style={imageStyle} />
            )}
            <br></br>
            <LikeButton complaintId={c._id} />
            <CommentSection complaintId={c._id} />
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
