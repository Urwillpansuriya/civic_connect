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
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
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
                  type="text"
                  name="cityName"
                  placeholder="e.g. Surat"
                  value={formData.cityName}
                  onChange={handleChange}
                  required
                  className="form-control"
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
            <button
              onClick={() => {
                setModal({ ...modal, show: false });
                if (modal.title === 'Success') navigate('/dashboard');
                if (modal.title === 'Login Required') navigate('/login');
              }}
              className="btn-primary"
              style={{ width: 'auto', padding: '10px 28px' }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ComplaintForm;
