import React, { useState } from 'react';
import axios from 'axios';

function ComplaintSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/complaints/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
      alert('Search error');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2>Search Complaints</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title or location"
          style={{
            padding: '10px',
            flex: 1,
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
        <button onClick={handleSearch} style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Search
        </button>
      </div>

      <div>
        {results.length === 0 && query && <p>No complaints found.</p>}
        {results.map(c => (
          <div key={c._id} style={{
            border: '1px solid #ddd',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
          }}>
            <h4>{c.title}</h4>
            <p><strong>Location:</strong> {c.location}</p>
            <p>{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComplaintSearch;
