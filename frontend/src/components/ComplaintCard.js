import { useState } from 'react';
import axios from 'axios';

function LikeButton({ complaintId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = async () => {
    const res = await axios.post(`http://localhost:5000/api/complaints/like/${complaintId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setLikes(res.data.likes);
  };

  return <button onClick={handleLike}>👍 {likes}</button>;
}

export default LikeButton;
