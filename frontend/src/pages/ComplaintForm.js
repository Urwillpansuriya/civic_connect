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





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, isAuthenticated } from '../utils/auth';
import MapPicker from '../components/MapPicker';
import 'leaflet/dist/leaflet.css';
const API_URL = "https://civic-connect-hams.onrender.com";

function ComplaintForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
    placeName: '',
   areaName: '',
   cityName: ''
  });

  const [preview, setPreview] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '', location: '' });
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: ''
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/categories`)
      .then(res => {
        const catArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.categories)
          ? res.data.categories
          : [];
        setCategories(catArray);
      })
      .catch(err => {
        console.error('Failed to load categories', err);
        setCategories([]);
      });
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, [e.target.name]: e.target.value, image: file });

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  // useEffect(() => {
  //   axios.get('http://localhost:5000/api/categories')
  //     .then(res => setCategories(res.data))
  //     .catch(err => {
  //       console.error('Failed to load categories', err);
  //       setCategories([]);
  //     });
  // }, []);

//   useEffect(() => {
//   axios.get('http://localhost:5000/api/categories')
//     .then(res => {
//       const catArray = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data.categories)
//         ? res.data.categories
//         : [];
//       setCategories(catArray);
//     })
//     .catch(err => {
//       console.error('Failed to load categories', err);
//       setCategories([]);
//     });
// }, []);


  const handleSubmit = async e => {
    
    e.preventDefault();
    if (!isAuthenticated()) {
      setModal({
        show: true,
        title: 'Login Required',
        message: 'Please login first'
      });
      return;
    }

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
      if (formData.image) {
        data.append('image', formData.image);
      }
      const res = await axios.post(`${API_URL}/api/complaints/add`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res && res.data) {
        setModal({
          show: true,
          title: 'Success',
          message: 'Complaint submitted!'
        });
        navigate('/dashboard');
      } else {
        alert('Server responded but no data returned.');
      }

    } catch (err) {
      console.error('Submission error:', err);
      if (err.response) {
        console.error('Error response from server:', err.response.data);
      }
      setModal({
        show: true,
        title: 'Error',
        message: 'Error submitting complaint. See console.'
      });
    }
  };

  // 🔶 Internal CSS Styles
  const containerStyle = {
    maxWidth: '600px',
     width: '100%',
    margin: '30px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fafafa',
    boxSizing: 'border-box'
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
  boxSizing: 'border-box',
  display: 'block'
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
    maxWidth: '300px',
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

      {/* 📍 Place Name */}
      <input
        type="text"
        name="placeName"
        placeholder="Place Name (e.g. Opposite Laxmi Medical)"
        value={formData.placeName}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      {/* 🏘️ Area Name */}
      <input
        type="text"
        name="areaName"
        placeholder="Area Name (e.g. Hirabag)"
        value={formData.areaName}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      {/* 🏙️ City Name */}
      <input
        type="text"
        name="cityName"
        placeholder="City Name (e.g. Surat)"
        value={formData.cityName}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      {/* 📌 Auto Location (readonly) */}
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={coordinates.location}
        readOnly
        style={inputStyle}
      />

      {/* 🗂️ Category */}
      <select name="category" onChange={handleChange} required style={selectStyle} value={formData.category}>
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      {/* 🗓️ Date */}
      <p style={{ marginTop: '10px' }}>
        <strong>Date:</strong> {new Date().toLocaleDateString()}
      </p>

      {/* 📷 Image Upload */}
      <input type="file" name="image" onChange={handleChange} style={inputStyle} />
      {preview && <img src={preview} alt="Preview" style={previewStyle} />}

      {/* 🗺️ Map Picker */}
      <MapPicker
        onLocationSelect={(lat, lng, locationName) => {
          setCoordinates({ lat, lng, location: locationName });
        }}
      />

      {/* 🚀 Submit */}
      <button type="submit" style={buttonStyle}>Submit</button>
    </form>
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
          <button onClick={() => {
            setModal({ ...modal, show: false });
            // Optionally, redirect after success
            if (modal.title === 'Success') navigate('/dashboard');
            if (modal.title === 'Login Required') navigate('/login');
          }} style={{
            marginTop: '10px',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '5px',
            background: '#007bff',
            color: '#fff',
            cursor: 'pointer'
          }}>
            OK
          </button>
        </div>
      </div>
    )}
  </div>
);

}

export default ComplaintForm;

