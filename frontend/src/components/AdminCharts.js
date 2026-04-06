import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { getToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

const STATUS_COLORS = {
  pending: '#ffc107',
  'in-progress': '#17a2b8',
  resolved: '#28a745',
  rejected: '#dc3545'
};

function AdminCharts() {
  const [days, setDays] = useState(7);
  const [perDayData, setPerDayData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [perDayRes, statusRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/complaints-per-day?days=${days}`, { headers }),
        axios.get(`${API_URL}/api/analytics/status-breakdown`, { headers })
      ]);
      setPerDayData(perDayRes.data);
      setStatusData(statusRes.data.map(s => ({ ...s, fill: STATUS_COLORS[s.status] || '#8884d8' })));
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  // Initial fetch + re-fetch when 'days' changes
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Socket.io – re-fetch analytics whenever complaints change
  useEffect(() => {
    const socket = io(API_URL, { transports: ['websocket', 'polling'] });

    const refresh = () => fetchAnalytics();
    socket.on('complaint:new', refresh);
    socket.on('complaint:updated', refresh);
    socket.on('complaint:deleted', refresh);

    return () => {
      socket.off('complaint:new', refresh);
      socket.off('complaint:updated', refresh);
      socket.off('complaint:deleted', refresh);
      socket.disconnect();
    };
  }, [fetchAnalytics]);

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Loading charts…</p>;
  }

  return (
    <div style={{
      display: 'flex',
      gap: '24px',
      flexWrap: 'wrap',
      marginBottom: '40px'
    }}>
      {/* ── Chart 1: Complaints per Day ─────────────────────────── */}
      <div style={chartCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>📊 Complaints per Day</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setDays(7)}
              style={toggleBtn(days === 7)}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDays(30)}
              style={toggleBtn(days === 30)}
            >
              Last 30 Days
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={perDayData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={d => {
                const [, m, day] = d.split('-');
                return `${day}/${m}`;
              }}
              tick={{ fontSize: 11 }}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v) => [v, 'Complaints']}
              labelFormatter={l => `Date: ${l}`}
            />
            <Bar dataKey="count" fill="#4f8ef7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Chart 2: Status Breakdown ───────────────────────────── */}
      <div style={chartCardStyle}>
        <h3 style={{ margin: '0 0 16px', color: '#333' }}>🥧 Status Breakdown</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ status, percent }) =>
                `${status} ${(percent * 100).toFixed(0)}%`
              }
            >
              {statusData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(v, name) => [v, name]} />
            <Legend formatter={v => v.charAt(0).toUpperCase() + v.slice(1)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const chartCardStyle = {
  flex: '1',
  minWidth: '300px',
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const toggleBtn = (active) => ({
  padding: '5px 12px',
  fontSize: '13px',
  borderRadius: '20px',
  border: `1px solid ${active ? '#4f8ef7' : '#ccc'}`,
  backgroundColor: active ? '#4f8ef7' : '#f5f5f5',
  color: active ? '#fff' : '#555',
  cursor: 'pointer',
  transition: 'all 0.2s'
});

export default AdminCharts;
