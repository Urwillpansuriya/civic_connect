import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getImageSrc from '../utils/image';
import Layout from '../components/Layout';
import CommentSection from '../components/CommentSection';
import LikeButton from '../components/LikeButton';
import '../components/Layout.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

function getStatusClass(status) {
  const s = (status || '').toLowerCase().replace(' ', '-');
  if (s === 'pending') return 'pill pill--pending';
  if (s === 'in-progress' || s === 'inprogress') return 'pill pill--in-progress';
  if (s === 'resolved') return 'pill pill--resolved';
  if (s === 'rejected') return 'pill pill--rejected';
  return 'pill pill--default';
}

function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/complaints/${id}`)
      .then((res) => setComplaint(res.data))
      .catch((err) => console.error('Error loading complaint:', err));
  }, [id]);

  if (!complaint) {
    return (
      <Layout>
        <div
          className="card"
          style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
          <p>Loading complaint details…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: '#6d28d9',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          padding: '0 0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        ← Back
      </button>

      <div className="card">
        {/* Header */}
        <div className="detail-header">
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: '22px', color: '#1e1b4b' }}>
              {complaint.title}
            </h2>
            <span className={getStatusClass(complaint.status)}>
              {complaint.status}
            </span>
          </div>
          <LikeButton
            complaintId={complaint._id}
            initialLikes={complaint.likes || 0}
          />
        </div>

        {/* Image */}
        {complaint.imageUrl && (
          <img
            src={getImageSrc(complaint.imageUrl)}
            alt="Complaint"
            className="detail-image"
          />
        )}

        {/* Description */}
        <p
          style={{
            fontSize: '15px',
            color: '#374151',
            lineHeight: '1.6',
            marginBottom: '20px',
          }}
        >
          {complaint.description}
        </p>

        {/* Meta grid */}
        <div className="detail-meta-grid">
          <div className="detail-meta-item">
            <strong>Category</strong>
            <span>{complaint.category || '—'}</span>
          </div>
          <div className="detail-meta-item">
            <strong>Place</strong>
            <span>{complaint.placeName || '—'}</span>
          </div>
          <div className="detail-meta-item">
            <strong>Area</strong>
            <span>{complaint.areaName || '—'}</span>
          </div>
          <div className="detail-meta-item">
            <strong>City</strong>
            <span>{complaint.cityName || '—'}</span>
          </div>
          <div className="detail-meta-item">
            <strong>Location</strong>
            <span>{complaint.location || '—'}</span>
          </div>
          <div className="detail-meta-item">
            <strong>Submitted by</strong>
            <span>{complaint.user?.name || 'Anonymous'}</span>
          </div>
          <div className="detail-meta-item">
            <strong>Date</strong>
            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid #ede9fe', margin: '24px 0' }} />

        {/* Comments */}
        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px', color: '#1e1b4b' }}>
          💬 Comments
        </h3>
        <CommentSection complaintId={complaint._id} />
      </div>
    </Layout>
  );
}

export default ComplaintDetail;
