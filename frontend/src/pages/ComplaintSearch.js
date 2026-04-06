import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../components/Layout.css';

const API_URL = 'https://civic-connect-hams.onrender.com';

function getStatusClass(status) {
  const s = (status || '').toLowerCase().replace(' ', '-');
  if (s === 'pending') return 'pill pill--pending';
  if (s === 'in-progress' || s === 'inprogress') return 'pill pill--in-progress';
  if (s === 'resolved') return 'pill pill--resolved';
  if (s === 'rejected') return 'pill pill--rejected';
  return 'pill pill--default';
}

function ComplaintSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', message: '' });
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e && e.preventDefault();
    if (!query.trim()) return;
    try {
      const res = await axios.get(`${API_URL}/api/complaints/search?q=${query}`);
      const complaintsData = res.data.complaints || res.data;
      setResults(Array.isArray(complaintsData) ? complaintsData : []);
      setSearched(true);
    } catch (err) {
      console.error('Search failed:', err);
      setModal({ show: true, title: 'Error', message: 'Search error. Please try again.' });
    }
  };

  return (
    <Layout>
      <div className="welcome-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>🔍 Search Complaints</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
          Find complaints by title, location or keyword
        </p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch} className="search-bar-row" style={{ margin: 0 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or location…"
            className="search-input"
          />
          <button
            type="submit"
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(90deg, #6d28d9, #7c3aed)',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>
      </div>

      {searched && results.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔎</div>
          <p>No complaints found for "{query}".</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="complaint-grid">
          {results.map((c) => (
            <div
              key={c._id}
              className="complaint-card"
              onClick={() => navigate(`/complaints/${c._id}`)}
            >
              <p className="complaint-card__title">{c.title}</p>
              <p className="complaint-card__meta">📍 {c.placeName || c.location || 'Unknown'}</p>
              <p className="complaint-card__desc">{c.description}</p>
              <div className="complaint-card__footer">
                <span className={getStatusClass(c.status)}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '300px', textAlign: 'center' }}>
            <h3>{modal.title}</h3>
            <p>{modal.message}</p>
            <button onClick={() => setModal({ ...modal, show: false })} style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', background: '#6d28d9', color: '#fff', cursor: 'pointer' }}>OK</button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ComplaintSearch;
