import React from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999
};

const boxStyle = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '8px',
  minWidth: '300px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  textAlign: 'center'
};

export default function Modal({ show, title, message, onClose }) {
  if (!show) return null;
  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h3>{title}</h3>
        <p>{message}</p>
        <button
          onClick={onClose}
          style={{
            marginTop: '16px',
            padding: '8px 20px',
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
  );
}