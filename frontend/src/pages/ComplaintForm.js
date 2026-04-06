import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, isAuthenticated } from '../utils/auth';
import MapPicker from '../components/MapPicker';
import Layout from '../components/Layout';
import 'leaflet/dist/leaflet.css';
import '../components/Layout.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

function ComplaintForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
    placeName: '',
    areaName: '',
    cityName: '',
  });

  const [preview, setPreview] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '', location: '' });
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState({ show: false, title: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/categories`)
      .then((res) => {
        const catArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.categories)
          ? res.data.categories
          : [];
        setCategories(catArray);
      })
      .catch((err) => {
        console.error('Failed to load categories', err);
        setCategories([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      if (file) {
        if (!file.type.match(/^image\/(jpeg|png)$/)) {
          setModal({ show: true, title: 'Invalid File', message: 'Only jpg, jpeg and png images are allowed.' });
          e.target.value = '';
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setModal({ show: true, title: 'File Too Large', message: 'Image must be smaller than 5 MB.' });
          e.target.value = '';
          return;
        }
        setFormData((prev) => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
  const validateImage = (file, inputRef) => {
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setModal({ show: true, title: 'Invalid File', message: 'Only jpg, jpeg and png images are allowed.' });
      if (inputRef) inputRef.value = '';
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setModal({ show: true, title: 'File Too Large', message: 'Image must be smaller than 5 MB.' });
      if (inputRef) inputRef.value = '';
      return false;
    }
    return true;
  };

  const applyImage = (file) => {
    setFormData(prev => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      if (file && validateImage(file, e.target)) {
        applyImage(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  const handleDrop = e => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && validateImage(file, null)) {
      applyImage(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isAuthenticated()) {
      setModal({ show: true, title: 'Login Required', message: 'Please login first' });
      return;
    }
    setSubmitting(true);
    try {
      const token = getToken();
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', coordinates.location || 'Unknown');
      data.append('placeName', formData.placeName);
      data.append('areaName', formData.areaName);
      data.append('cityName', formData.cityName);
      data.append('category', formData.category);
      data.append('lat', coordinates.lat);
      data.append('lng', coordinates.lng);
      if (formData.image) data.append('image', formData.image);

      const res = await axios.post(`${API_URL}/api/complaints/add`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      if (res && res.data) {
        setModal({ show: true, title: 'Success', message: 'Complaint submitted successfully!' });
      } else {
        setModal({ show: true, title: 'Error', message: 'Server responded but no data returned.' });
      }
    } catch (err) {
      console.error('Submission error:', err);
      setModal({ show: true, title: 'Error', message: 'Error submitting complaint. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="form-container">
        {/* Page heading */}
        <div className="welcome-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>📝 Submit a Complaint</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
            Help your community by reporting civic issues
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Complaint Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g. Broken road near school"
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the issue in detail…"
                onChange={handleChange}
                className="form-control form-control--textarea"
              />
            </div>

            {/* Place / Area / City */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '12px',
              }}
            >
              <div className="form-group">
                <label htmlFor="placeName">Place Name *</label>
                <input
                  id="placeName"
    <div style={s.page}>
      {/* Back button */}
      <button onClick={() => navigate('/dashboard')} style={s.backBtn}>← Back to Dashboard</button>

      <div style={s.container}>
        {/* Page header */}
        <div style={s.pageHeader}>
          <div style={s.pageHeaderIcon}>📝</div>
          <div>
            <h2 style={s.pageTitle}>Submit a Complaint</h2>
            <p style={s.pageSubtitle}>Help improve your community by reporting issues</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section: Complaint Details */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>📋 Complaint Details</h3>
            <div style={s.fieldGroup}>
              <label style={s.label}>Title <span style={s.req}>*</span></label>
              <input
                type="text"
                name="title"
                placeholder="Brief title of the issue"
                onChange={handleChange}
                required
                style={s.input}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Description</label>
              <textarea
                name="description"
                placeholder="Describe the issue in detail…"
                onChange={handleChange}
                style={s.textarea}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Category <span style={s.req}>*</span></label>
              <select name="category" onChange={handleChange} required style={s.select} value={formData.category}>
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section: Location */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>📍 Location Details</h3>
            <div className="cc-two-col" style={s.twoCol}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Place Name <span style={s.req}>*</span></label>
                <input
                  type="text"
                  name="placeName"
                  placeholder="e.g. Opposite Laxmi Medical"
                  value={formData.placeName}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="areaName">Area Name *</label>
                <input
                  id="areaName"
                  style={s.input}
                />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Area Name <span style={s.req}>*</span></label>
                <input
                  type="text"
                  name="areaName"
                  placeholder="e.g. Hirabag"
                  value={formData.areaName}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cityName">City Name *</label>
                <input
                  id="cityName"
                  style={s.input}
                />
              </div>
            </div>
            <div className="cc-two-col" style={s.twoCol}>
              <div style={s.fieldGroup}>
                <label style={s.label}>City Name <span style={s.req}>*</span></label>
                <input
                  type="text"
                  name="cityName"
                  placeholder="e.g. Surat"
                  value={formData.cityName}
                  onChange={handleChange}
                  required
                  className="form-control"
                  style={s.input}
                />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Auto-detected Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Pick on map below"
                  value={coordinates.location}
                  readOnly
                  style={{ ...s.input, backgroundColor: '#f9fafb', color: '#9ca3af' }}
                />
              </div>
            </div>

            {/* Auto-detected location */}
            <div className="form-group">
              <label htmlFor="location">Auto-detected Location</label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="Pick a location on the map below"
                value={coordinates.location}
                readOnly
                className="form-control"
                style={{ background: '#f9fafb', color: '#6b7280' }}
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                onChange={handleChange}
                required
                className="form-control"
                value={formData.category}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                value={new Date().toLocaleDateString()}
                readOnly
                className="form-control"
                style={{ background: '#f9fafb', color: '#6b7280' }}
              />
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label htmlFor="image">Upload Image (jpg/png, max 5 MB)</label>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/jpeg,image/png"
                onChange={handleChange}
                className="form-control"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxWidth: '280px',
                    marginTop: '10px',
                    borderRadius: '10px',
                    border: '2px solid #ede9fe',
                  }}
                />
              )}
            </div>

            {/* Map Picker */}
            <div className="form-group">
              <label>Pick Location on Map</label>
              <div
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid #ddd',
                }}
              >
                <MapPicker
                  onLocationSelect={(lat, lng, locationName) => {
                    setCoordinates({ lat, lng, location: locationName });
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : '🚀 Submit Complaint'}
            </button>
          </form>
        </div>
            {/* Map */}
            <div style={s.mapCard}>
              <p style={s.mapHint}>📌 Click on the map to set exact coordinates</p>
              <MapPicker
                onLocationSelect={(lat, lng, locationName) => {
                  setCoordinates({ lat, lng, location: locationName });
                }}
              />
            </div>
          </div>

          {/* Section: Image Upload */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>📷 Upload Image</h3>
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload image: drag and drop or press Enter to browse"
              style={{ ...s.dropzone, ...(dragOver ? s.dropzoneActive : {}) }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById('cc-file-input')?.click();
                }
              }}
            >
              {preview ? (
                <div style={s.previewWrap}>
                  <img src={preview} alt="Preview" style={s.previewImg} />
                  <button
                    type="button"
                    style={s.removeImgBtn}
                    onClick={() => { setPreview(null); setFormData(p => ({ ...p, image: null })); }}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <>
                  <div style={s.dropzoneIcon}>📂</div>
                  <p style={s.dropzoneText}>Drag &amp; drop an image here, or</p>
                  <label style={s.browseBtn}>
                    Browse File
                    <input id="cc-file-input" type="file" name="image" accept="image/jpeg,image/png" onChange={handleChange} style={{ display: 'none' }} />
                  </label>
                  <p style={s.dropzoneHint}>Supports JPG, PNG · Max 5 MB</p>
                </>
              )}
            </div>
          </div>

          {/* Date info */}
          <p style={s.dateInfo}>📅 Submission date: {new Date().toLocaleDateString()}</p>

          {/* Submit */}
          <button type="submit" style={s.submitBtn}>🚀 Submit Complaint</button>
        </form>
      </div>

      {/* Modal */}
      {modal.show && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '28px 32px',
              borderRadius: '14px',
              width: '320px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>
              {modal.title === 'Success' ? '✅' : modal.title === 'Login Required' ? '🔒' : '⚠️'}
            </div>
            <h3 style={{ margin: '0 0 8px', color: '#1e1b4b' }}>{modal.title}</h3>
            <p style={{ margin: '0 0 20px', color: '#4b5563', fontSize: '14px' }}>{modal.message}</p>
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>
              {modal.title === 'Success' ? '✅' : modal.title === 'Login Required' ? '🔒' : '❌'}
            </div>
            <h3 style={{ margin: '0 0 8px', color: '#1f2937' }}>{modal.title}</h3>
            <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: '14px' }}>{modal.message}</p>
            <button
              onClick={() => {
                setModal({ ...modal, show: false });
                if (modal.title === 'Success') navigate('/dashboard');
                if (modal.title === 'Login Required') navigate('/login');
              }}
              className="btn-primary"
              style={{ width: 'auto', padding: '10px 28px' }}
              style={s.modalBtn}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)',
    padding: '24px 16px 40px',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    boxSizing: 'border-box'
  },
  backBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '20px',
    display: 'inline-block'
  },
  container: {
    maxWidth: '680px',
    margin: '0 auto',
    width: '100%'
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px'
  },
  pageHeaderIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0
  },
  pageTitle: {
    margin: '0 0 4px',
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff'
  },
  pageSubtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255,255,255,0.75)'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  cardTitle: {
    margin: '0 0 20px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#1f2937'
  },
  fieldGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  },
  req: {
    color: '#ef4444'
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    fontSize: '15px',
    color: '#1f2937',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    transition: 'border-color 0.2s'
  },
  textarea: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    fontSize: '15px',
    color: '#1f2937',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    height: '110px',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  select: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    fontSize: '15px',
    color: '#1f2937',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  mapCard: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1.5px solid #e5e7eb',
    marginTop: '8px'
  },
  mapHint: {
    margin: 0,
    padding: '10px 14px',
    fontSize: '13px',
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  dropzone: {
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    backgroundColor: '#f9fafb'
  },
  dropzoneActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff'
  },
  dropzoneIcon: {
    fontSize: '36px',
    marginBottom: '8px'
  },
  dropzoneText: {
    margin: '0 0 12px',
    fontSize: '14px',
    color: '#6b7280'
  },
  dropzoneHint: {
    margin: '10px 0 0',
    fontSize: '12px',
    color: '#9ca3af'
  },
  browseBtn: {
    display: 'inline-block',
    padding: '9px 20px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  previewWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  previewImg: {
    maxWidth: '260px',
    maxHeight: '180px',
    borderRadius: '10px',
    objectFit: 'cover',
    border: '1px solid #e5e7eb'
  },
  removeImgBtn: {
    padding: '6px 16px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  dateInfo: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '13px',
    marginBottom: '16px'
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    border: '2px solid rgba(255,255,255,0.4)',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.3px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  },
  modal: {
    backgroundColor: '#fff',
    padding: '28px 32px',
    borderRadius: '16px',
    width: '320px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  modalBtn: {
    padding: '10px 32px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default ComplaintForm;
