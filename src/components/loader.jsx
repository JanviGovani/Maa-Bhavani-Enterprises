import React from 'react';
import './loader.css'; // We will add a simple pulse animation here

const Loader = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh'
    }}>
      {/* Your Logo appearing as a Loader */}
      <img 
        src="/MB-logo.png" 
        alt="Loading..." 
        className="loader-logo"
        style={{ width: '100px', marginBottom: '20px' }} 
      />
      <p style={{ fontWeight: 'bold', color: '#555' }}>Loading...</p>
    </div>
  );
};

export default Loader;