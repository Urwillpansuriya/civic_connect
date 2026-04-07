import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

function LikeButton({ complaintId, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [clicked, setClicked] = useState(false);

  const handleLike = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/complaints/like/${complaintId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLikes(res.data.likes);
      setClicked(!clicked);
    } catch (err) {
      console.error('Like error:', err);
      if (err.response?.status === 401) {
        alert('Login required to like a complaint.');
      }
    }
  };

  return (
    <button onClick={handleLike} style={{
      backgroundColor: clicked ? '#28a745' : '#eeeeee',
      color: clicked ? '#fff' : '#333',
      padding: '6px 14px',
      border: 'none',
      borderRadius: '20px',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      marginTop: '10px'
    }}>
      👍 Like {likes}
    </button>
  );
}

export default LikeButton;
