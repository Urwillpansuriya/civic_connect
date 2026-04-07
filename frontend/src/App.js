import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintList from './pages/ComplaintList';
import ComplaintMap from './pages/ComplaintMap';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import PublicMap from './pages/PublicMap';
import ComplaintDetail from './pages/ComplaintDetail';
import PublicDashboard from './pages/PublicDashboard';
import AddCategory from './pages/AddCategory';
import ComplaintStatusPage from './pages/ComplaintStatusPage';
import ComplaintSearch from './pages/ComplaintSearch';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public dashboard is the default landing page */}
        <Route path="/" element={<PublicDashboard />} />
        <Route path="/public-dashboard" element={<PublicDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-complaint" element={<ComplaintForm />} />
        <Route path="/complaints" element={<ComplaintList />} />
        <Route path="/map" element={<ComplaintMap />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/public-map" element={<PublicMap />} />
        <Route path="/complaints/:id" element={<ComplaintDetail />} />
        <Route path="/map-view" element={<ComplaintMap />} />
        <Route path="/admin/add-category" element={<AddCategory />} />
        <Route path="/admin/complaints/:id" element={<ComplaintStatusPage />} />
        <Route path="/search" element={<ComplaintSearch />} />
        {/* Catch-all: redirect unknown routes to public dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
