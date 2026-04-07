// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import { useState, useEffect } from 'react';
// import L from 'leaflet';

// // Default Leaflet marker icon (important for correct display)
// const defaultIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41]
// });

// function LocationMarker({ onSelect }) {
//   const [position, setPosition] = useState(null);

//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setPosition(e.latlng);
//       onSelect(lat, lng);
//     }
//   });

//   return position === null ? null : (
//     <Marker position={position} icon={defaultIcon} />
//   );
// }

// export default function MapPicker({ onLocationSelect }) {
//   const [initial, setInitial] = useState([20.5937, 78.9629]); // Default India

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setInitial([latitude, longitude]);

//         const locationName = await reverseGeocode(latitude, longitude);
//         onLocationSelect(latitude, longitude, locationName);
//       },
//       () => console.warn('Geolocation blocked or not allowed.')
//     );
//   }, [onLocationSelect]);

//   const handleMapClick = async (lat, lng) => {
//     const locationName = await reverseGeocode(lat, lng);
//     onLocationSelect(lat, lng, locationName);
//   };

//   return (
//     <MapContainer center={initial} zoom={13} style={{ height: '300px' }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <LocationMarker onSelect={handleMapClick} />
//     </MapContainer>
//   );
// }

// // 📍 Reverse Geocode Function: Get area/city name from lat/lng
// const reverseGeocode = async (lat, lng) => {
//   try {
//     const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
//     const data = await res.json();
//     return data?.address?.suburb || data?.address?.city || '';
//   } catch (error) {
//     console.warn('Reverse geocoding failed:', error);
//     return '';
//   }
// };





import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';

// Set default icon for Leaflet marker
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Marker component that updates position on map click
function LocationMarker({ position, onMapClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      console.log("📍 Map clicked:", lat, lng);
      onMapClick(lat, lng);
    },
  });

  return position ? <Marker position={position} icon={defaultIcon} /> : null;
}

export default function MapPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default: India

  // Get readable location name from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      const locationName = data?.address?.suburb || data?.address?.city || data?.address?.town || data?.address?.state || '';
      return locationName;
    } catch (error) {
      console.warn("Reverse geocoding failed:", error);
      return '';
    }
  };

  // Auto-detect location on component load
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("❌ Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("✅ Auto GPS:", latitude, longitude);

        setPosition([latitude, longitude]);
        setMapCenter([latitude, longitude]);

        const location = await reverseGeocode(latitude, longitude);
        onLocationSelect(latitude, longitude, location);
      },
      (err) => {
        console.warn("❌ Geolocation error:", err.message);
        setMapCenter([20.5937, 78.9629]); // fallback
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onLocationSelect]);

  // Handle manual map click
  const handleMapClick = async (lat, lng) => {
    setPosition([lat, lng]);
    const location = await reverseGeocode(lat, lng);
    onLocationSelect(lat, lng, location);
  };

  return (
    <MapContainer center={mapCenter} zoom={5} style={{ height: '300px', marginBottom: '1rem' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker position={position} onMapClick={handleMapClick} />
    </MapContainer>
  );
}
