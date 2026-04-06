import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import './Layout.css';

const API_URL = 'https://civic-connect-hams.onrender.com';

const CommentSection = ({ complaintId }) => {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/comments/${complaintId}`);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setComments([]);
    }
  }, [complaintId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await axios.post(
        `${API_URL}/api/comments/${complaintId}`,
        { text: input },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setInput('');
      fetchComments();
    } catch (err) {
      console.error('Failed to post comment:', err.response?.data || err);
      setError('Failed to post comment');
    }
  };

  return (
    <div>
      <ul className="comment-list">
        {comments.length === 0 && (
          <li style={{ color: '#9ca3af', fontSize: '14px' }}>
            No comments yet. Be the first to comment!
          </li>
        )}
        {comments.map((c, idx) => (
          <li key={idx} className="comment-item">
            <strong>{c.user?.name || 'Anonymous'}: </strong>
            {c.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Write a comment…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="comment-input"
        />
        <button type="submit" className="btn-comment">
          Post
        </button>
      </form>
      {error && (
        <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default CommentSection;
