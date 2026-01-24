import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const items = [
  { id: 1, name: "Flange", hasSizes: true },
  { id: 3, name: "CI-CV", hasSizes: true },
  { id: 4, name: "Pipe", hasSizes: true },
  { id: 9, name: "Img 9", hasSizes: true },
  { id: 11, name: "Img 11", hasSizes: true },
  { id: 12, name: "Img 12", hasSizes: true },
  { id: 14, name: "Img 14", hasSizes: true },
  { id: 18, name: "Bolt", hasSizes: true },
  { id: 20, name: "Img 20", hasSizes: true },
];

const ProductSizes = () => {
  const { id } = useParams(); // Gets the ID of the clicked product
  const navigate = useNavigate();

  // This is a placeholder array. In a real app, you'd filter this based on the ID.
  const sizeVariations = [
    { sizeId: 1, label: "Size-2.5", img: "https://via.placeholder.com/150?text=Size-2.5" },
    { sizeId: 2, label: "Size-3",   img: "https://via.placeholder.com/150?text=Size-3" },
    { sizeId: 3, label: "Size-3.5", img: "https://via.placeholder.com/150?text=Size-3.5" },
    { sizeId: 4, label: "Size-4",   img: "https://via.placeholder.com/150?text=Size-4" },
  ];

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ padding: '8px 16px', cursor: 'pointer', marginBottom: '20px' }}
      >
        ← Back to Gallery
      </button>

      <h2>Product Variations for Item ID: {id}</h2>
      <p>Select the required size below:</p>

      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        justifyContent: "center", 
        gap: "20px", 
        marginTop: "20px" 
      }}>
        {sizeVariations.map((variant) => (
          <div key={variant.sizeId} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '10px',
            width: '180px'
          }}>
            <img 
              src={variant.img} 
              alt={variant.label} 
              style={{ width: "100%", borderRadius: "4px" }} 
            />
            <h4>{variant.label}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSizes;