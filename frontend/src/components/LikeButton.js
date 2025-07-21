import React, { useState } from 'react';
import axios from 'axios';

function LikeButton({ complaintId, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [clicked, setClicked] = useState(false);

  const handleLike = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/complaints/like/${complaintId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLikes(res.data.likes);
      setClicked(!clicked);
    } catch (err) {
      console.error('Like error:', err);
      alert('Login required to like a complaint.');
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
