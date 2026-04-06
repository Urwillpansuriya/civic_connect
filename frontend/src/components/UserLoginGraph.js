import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';

function UserLoginGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate mock login data for the last 7 days
    const today = new Date();
    const past7Days = [...Array(7)].map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        logins: Math.floor(Math.random() * 100), // Replace with real login count if needed
      };
    });
    setData(past7Days);
  }, []);

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '40px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>📈 User Logins - Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="logins"
            stroke="#8884d8"
            strokeWidth={3}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UserLoginGraph;
