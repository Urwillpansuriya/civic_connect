import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import L from 'leaflet';

// 📍 Marker icon config
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function PublicMap() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/complaints/all')
      .then(res => setComplaints(res.data))
      .catch(err => console.error('Error loading complaints:', err));
  }, []);

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '90vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 🔥 Heatmap overlay */}
      <HeatmapLayer
        fitBoundsOnLoad
        fitBoundsOnUpdate
        points={complaints}
        longitudeExtractor={m => m.coordinates?.lng}
        latitudeExtractor={m => m.coordinates?.lat}
        intensityExtractor={() => 1}
      />

      {/* 📍 Individual markers */}
      {complaints.map(c => (
        <Marker
          key={c._id}
          position={[c.coordinates.lat, c.coordinates.lng]}
          icon={markerIcon}
        >
          <Popup>
            <strong>{c.title}</strong><br />
            {c.description}<br />
            <em>{c.location}</em>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default PublicMap;
