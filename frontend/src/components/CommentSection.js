import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const CommentSection = ({ complaintId }) => {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, );

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${complaintId}`);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('❌ Failed to load comments:', err);
      setComments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await axios.post(`http://localhost:5000/api/comments/${complaintId}`, {
        text: input
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      setInput('');
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error('❌ Failed to post comment:', err.response?.data || err);
      setError('Failed to post comment');
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <ul style={{ paddingLeft: '15px' }}>
        {comments.map((c, idx) => (
          <li key={idx}>
            <strong>{c.user?.name || 'Anonymous'}:</strong> {c.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '70%', padding: '6px' }}
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '6px 12px' }}>
          Comment
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
    </div>
  );
};

export default CommentSection;
