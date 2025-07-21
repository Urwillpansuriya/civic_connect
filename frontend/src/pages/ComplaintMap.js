// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import axios from 'axios';
// import 'leaflet/dist/leaflet.css';

// function ComplaintMap() {
//   const [complaints, setComplaints] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/complaints/all', {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//       }
//     }).then(res => setComplaints(res.data));
//   }, []);

//   return (
//     <div style={{ height: '500px' }}>
//       <MapContainer center={[21.17, 72.83]} zoom={12} style={{ height: '100%' }}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         {complaints.map(c => (
//           c.coordinates?.lat && c.coordinates?.lng && (
//             <Marker key={c._id} position={[c.coordinates.lat, c.coordinates.lng]}>
//               <Popup>
//                 <strong>{c.title}</strong><br />
//                 {c.category}<br />
//                 {c.location}
//               </Popup>
//             </Marker>
//           )
//         ))}
//       </MapContainer>
//     </div>
//   );
// }

// export default ComplaintMap;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function ComplaintMap() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/complaints/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setComplaints(res.data);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        alert('Failed to load complaint data');
      }
    };

    fetchComplaints();
  }, []);

  // 🌐 CSS Styles
  const pageStyle = {
    margin: 0,
    padding: 0,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyle = {
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold'
  };

  const mapContainerStyle = {
    flex: 1,
    width: '100%'
  };

  return (
    <div style={pageStyle}>
      <div style={titleStyle}>All Complaints on Map</div>

      <div style={mapContainerStyle}>
        <MapContainer
          center={[21.17, 72.83]} // Surat default
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {complaints.map(c => {
            const lat = c.coordinates?.lat || c.lat;
            const lng = c.coordinates?.lng || c.lng;
            if (!lat || !lng) return null;

            return (
              <Marker key={c._id} position={[lat, lng]}>
                <Popup>
                  <strong>{c.title}</strong><br />
                  <em>{c.category}</em><br />
                  {c.location && <p>{c.location}</p>}
                  {c.description && <p>{c.description}</p>}
                  {c.imageUrl && (
                    <img
                      src={`http://localhost:5000/uploads/${c.imageUrl}`}
                      alt="Complaint"
                      style={{ width: '150px', borderRadius: '5px', marginTop: '5px' }}
                    />
                  )}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default ComplaintMap;
