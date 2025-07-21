// import React, { useState } from 'react';
// import axios from 'axios';
// import { getToken } from '../utils/auth';

// function SearchBar({ onResults }) {
//   const [query, setQuery] = useState('');

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.get(`http://localhost:5000/api/complaints/search?q=${query}`);
//     //   onResults(res.data);
//     onResults(Array.isArray(res.data) ? res.data : []);

//     } catch (err) {
//       console.error('Search error:', err);
//       alert('Failed to search complaints');
//     }
//   };

//   return (
//     <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
//       <input
//         type="text"
//         placeholder="Search by title or location..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         style={{
//           flex: 1,
//           padding: '10px',
//           borderRadius: '5px',
//           border: '1px solid #ccc'
//         }}
//       />
//       <button
//         type="submit"
//         style={{
//           padding: '10px 15px',
//           backgroundColor: '#007bff',
//           color: '#fff',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         Search
//       </button>
//     </form>
//   );
// }

// export default SearchBar;




import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

function SearchBar({ onResults }) {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    try {
      if (!query.trim()) {
        // fetch all complaints if empty query
        const res = await axios.get('http://localhost:5000/api/complaints/mine', {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });
        onResults(res.data);
        return;
      }

      const res = await axios.get(`http://localhost:5000/api/complaints/search?q=${query}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      onResults(res.data);
    } catch (err) {
      console.error('🔍 Search error:', err);
      onResults([]);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <input
        type="text"
        placeholder="Search complaints by title or location"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          padding: '10px',
          width: '300px',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          marginLeft: '10px',
          padding: '10px 15px',
          borderRadius: '6px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none'
        }}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;




