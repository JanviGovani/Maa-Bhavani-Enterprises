import React, { useState } from 'react';

export default function UserModal({ onSave }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      alert('Please enter both your name and mobile number.');
      return;
    }
    const userData = { name: name.trim(), mobile: mobile.trim() };
    localStorage.setItem('user-profile', JSON.stringify(userData));
    onSave(userData);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', padding: '30px', borderRadius: '8px',
        width: '90%', maxWidth: '400px', textAlign: 'center'
      }}>
        <h2>Welcome!</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Please enter your details to continue</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button
            type="submit"
            style={{
              padding: '10px', backgroundColor: '#007bff', color: 'white',
              border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}