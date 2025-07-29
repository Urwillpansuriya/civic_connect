// import React, { useState } from 'react';
// import axios from 'axios';
// import { getToken } from '../utils/auth';

// function AddCategory() {
//   const [name, setName] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/categories/add', { name }, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`
//         }
//       });
//       setMessage('✅ Category added: ' + res.data.name);
//       setName('');
//     } catch (err) {
//       setMessage('❌ ' + (err.response?.data?.error || 'Error adding category'));
//     }
//   };

//   return (
//     <div style={{ maxWidth: '400px', margin: '20px auto' }}>
//       <h3>Add Category</h3>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={name}
//           onChange={e => setName(e.target.value)}
//           placeholder="Category name"
//           required
//           style={{ padding: '10px', width: '100%' }}
//         />
//         <button type="submit" style={{ marginTop: '10px' }}>Add</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default AddCategory;












import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

function AddCategory() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [modal, setModal] = useState({
  show: false,
  title: '',
  message: ''
});


  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/categories/add', { name }, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      
      setMessage('Category added: ' + res.data.name);
      setModal({
  show: true,
  title: 'Success',
  message: 'Category added successfully!'
});

      setName('');
     
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add category');

    }
  };

  return (
  <div style={{ textAlign: 'left', marginTop: '20px', marginLeft: '-10px' }}>
    <h3 style={{ marginBottom: '8px' }}>Add Category</h3>
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Category name"
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '16px',
          width: '250px',
          boxSizing: 'border-box'
        }}
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <button
        type="submit"
        style={{
          marginLeft: '10px',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add
      </button>
    </form>

    {message && <p>{message}</p>}

    {/* ✅ Modal */}
    {modal.show && (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          width: '300px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center'
        }}>
          <h3>{modal.title}</h3>
          <p>{modal.message}</p>
          <button
            onClick={() => setModal({ ...modal, show: false })}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '5px',
              background: '#007bff',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        </div>
      </div>
    )}
  </div>
);

}

export default AddCategory;
