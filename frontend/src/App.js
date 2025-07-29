import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintList from './pages/ComplaintList';
import ComplaintMap from './pages/ComplaintMap'; // for user complaint map view
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import PublicMap from './pages/PublicMap'; // ✅ add import for this
import ComplaintDetail from './pages/ComplaintDetail';
import PublicDashboard from './pages/PublicDashboard';
import AddCategory from './pages/AddCategory';
import ComplaintStatusPage from './pages/ComplaintStatusPage';
import ComplaintSearch from './pages/ComplaintSearch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-complaint" element={<ComplaintForm />} />
        <Route path="/complaints" element={<ComplaintList />} />
        <Route path="/map" element={<ComplaintMap />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/public-map" element={<PublicMap />} /> {/* ✅ unique path */}
        <Route path="/complaints/:id" element={<ComplaintDetail />} />
        <Route path="/map-view" element={<ComplaintMap />} /> {/* ✅ unique path */}
        <Route path="/public-dashboard" element={<PublicDashboard />} />
        <Route path="/admin/add-category" element={<AddCategory />} />
        <Route path="/admin/complaints/:id" element={<ComplaintStatusPage />} />
        <Route path="/search" element={<ComplaintSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
