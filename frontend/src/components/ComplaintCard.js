import { useState } from 'react';
import API from '../utils/api';

function LikeButton({ complaintId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = async () => {
    try {
      const res = await API.post(`/api/complaints/like/${complaintId}`);
      setLikes(res.data.likes);
    } catch (err) {
      console.error('Like error:', err);
      if (err.response?.status === 401) {
        alert('Login required to like a complaint.');
      } else if (err.code === 'ENOTFOUND' || err.message.includes('Network Error')) {
        alert('No internet connection. Like feature requires internet access.');
      } else {
        alert('Failed to like complaint. Please try again.');
      }
    }
  };

  return <button onClick={handleLike}>👍 {likes}</button>;
}

export default LikeButton;

