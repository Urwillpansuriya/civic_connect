// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { getToken, isAuthenticated } from '../utils/auth';
// import MapPicker from '../components/MapPicker';
// import 'leaflet/dist/leaflet.css';

// function ComplaintForm() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     image: null
//   });

//   const [preview, setPreview] = useState(null);
//   const [coordinates, setCoordinates] = useState({ lat: '', lng: '', location: '' });

//   const handleChange = e => {
//     const { name, value, files } = e.target;

//     if (name === 'image') {
//       const file = files[0];
//       setFormData({ ...formData, image: file });

//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result);
//       reader.readAsDataURL(file);
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

// const handleSubmit = async e => {
//   e.preventDefault();

//   if (!isAuthenticated()) {
//     alert('Please login first');
//     navigate('/login');
//     return;
//   }

//   try {
//     const token = getToken();
//     const data = new FormData();
//     data.append('title', formData.title);
//     data.append('description', formData.description);
//     data.append('location', coordinates.location || 'Unknown');
//     data.append('category', formData.category);
//     data.append('lat', coordinates.lat);
//     data.append('lng', coordinates.lng);
//     if (formData.image) {
//       data.append('image', formData.image);
//     }

//     // 🐞 LOGGING for Debug
//     console.log("Submitting complaint with data:", {
//       title: formData.title,
//       description: formData.description,
//       category: formData.category,
//       lat: coordinates.lat,
//       lng: coordinates.lng,
//       location: coordinates.location,
//       image: formData.image,
//     });
//     console.log('🚀 FormData before submit:', Object.fromEntries(data.entries()));
//     // ✅ Save response properly
//     const res = await axios.post('http://localhost:5000/api/complaints/add', data, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     });

//     // ✅ Safe access
//     if (res && res.data) {
//       alert('Complaint submitted!');
//       navigate('/dashboard');
//     } else {
//       alert('Server responded but no data returned.');
//       console.warn('Response:', res);
//     }

//   } catch (err) {
//     // 🐞 Show EXACT error
//     console.error('Submission error:', err);
//     if (err.response) {
//       console.error('Error response from server:', err.response.data);
//     }
//     alert('Error submitting complaint. See console.');
//   }
// };

//   return (
//     <div>
//       <h2>Submit a Complaint</h2>
//       <form onSubmit={handleSubmit}>

//         <input
//           type="text"
//           name="title"
//           placeholder="Title"
//           onChange={handleChange}
//           required
//         /><br />

//         <textarea
//           name="description"
//           placeholder="Description"
//           onChange={handleChange}
//         /><br />

//         <input
//           type="text"
//           name="location"
//           placeholder="Location"
//           value={coordinates.location}
//           readOnly
//         /><br />

//         <select name="category" onChange={handleChange} required>
//           <option value="">Select Category</option>
//           <option value="Road">Road</option>
//           <option value="Drainage">Drainage</option>
//           <option value="Garbage">Garbage</option>
//           <option value="Electricity">Electricity</option>
//           <option value="Other">Other</option>
//         </select><br />

//         <p>Date: {new Date().toLocaleDateString()}</p>

//         <input type="file" name="image" onChange={handleChange} /><br />
//         {preview && <img src={preview} alt="Preview" style={{ width: '200px', margin: '10px 0' }} />}

//         <MapPicker
//           onLocationSelect={(lat, lng, locationName) => {
//             console.log('Map selected:', lat, lng, locationName);
//             setCoordinates({ lat, lng, location: locationName });
//           }}
//         />

//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

// export default ComplaintForm;





import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, isAuthenticated } from '../utils/auth';
import MapPicker from '../components/MapPicker';
import 'leaflet/dist/leaflet.css';

function ComplaintForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null
  });

  const [preview, setPreview] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '', location: '' });

  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!isAuthenticated()) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    try {
      const token = getToken();
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', coordinates.location || 'Unknown');
      data.append('category', formData.category);
      data.append('lat', coordinates.lat);
      data.append('lng', coordinates.lng);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await axios.post('http://localhost:5000/api/complaints/add', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res && res.data) {
        alert('Complaint submitted!');
        navigate('/dashboard');
      } else {
        alert('Server responded but no data returned.');
      }

    } catch (err) {
      console.error('Submission error:', err);
      if (err.response) {
        console.error('Error response from server:', err.response.data);
      }
      alert('Error submitting complaint. See console.');
    }
  };

  // 🔶 Internal CSS Styles
  const containerStyle = {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fafafa'
  };

  const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  marginTop: '10px',
  marginBottom: '10px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  boxSizing: 'border-box'
};


  const textAreaStyle = {
    ...inputStyle,
    height: '100px',
    resize: 'vertical'
  };

  const selectStyle = {
    ...inputStyle
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    marginTop: '10px',
    cursor: 'pointer'
  };

  const previewStyle = {
    width: '200px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ccc'
  };

  return (
    <div style={containerStyle}>
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          style={textAreaStyle}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={coordinates.location}
          readOnly
          style={inputStyle}
        />

        <select name="category" onChange={handleChange} required style={selectStyle}>
          <option value="">Select Category</option>
          <option value="Road">Road</option>
          <option value="Drainage">Drainage</option>
          <option value="Garbage">Garbage</option>
          <option value="Electricity">Electricity</option>
          <option value="Other">Other</option>
        </select>

        <p style={{ marginTop: '10px' }}>
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <input type="file" name="image" onChange={handleChange} style={inputStyle} />
        {preview && <img src={preview} alt="Preview" style={previewStyle} />}

        <MapPicker
          onLocationSelect={(lat, lng, locationName) => {
            setCoordinates({ lat, lng, location: locationName });
          }}
        />

        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
}

export default ComplaintForm;
