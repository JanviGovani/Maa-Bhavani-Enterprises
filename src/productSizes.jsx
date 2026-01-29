import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Add useState and useEffect
import Loader from './components/loader';           // Ensure Loader is imported

const items = [
  { id: 1, name: "Thunder Hose Pipe", hasSizes: true },
  { id: 2, name: "Canvas Hose Pipes", hasSizes: false },
  { id: 3, name: "Section Pipes", hasSizes: true },
  { id: 4, name: "Butyl Water Proofing Tapes for ceiling(SHED) repairs", hasSizes: true },
  { id: 5, name: "Tractor Pumps", hasSizes: false },
  { id: 6, name: "Water Circulation Pumps", hasSizes: false },
  { id: 7, name: "Rubber Flange Washers", hasSizes: false },
  { id: 8, name: "CI Flanges", hasSizes: false },
  { id: 9, name: "Bends", hasSizes: true },
  { id: 10, name: "Grove Bends", hasSizes: true },
  { id: 11, name: "CI Hose Collars", hasSizes: true },
  { id: 12, name: "Reduce Hose Collars", hasSizes: true },
  { id: 13, name: "Hose Clamps", hasSizes: false },
  { id: 14, name: "Worm Drive Clamps", hasSizes: true },
  { id: 15, name: "All Agriculture Pump Clamps", hasSizes: false },
  { id: 16, name: "Niko Clamps", hasSizes: false },
  { id: 17, name: "CPVC Clamps", hasSizes: false },
  { id: 18, name: "Nail Clamps", hasSizes: true },
  { id: 19, name: "Agriculture Pump Foot Valves CI", hasSizes: false },
  { id: 20, name: "Ball Model A/T N.R. Valves", hasSizes: true },
];

const ProductSizes = () => {
  const { id } = useParams(); // Gets the ID of the clicked product
  const navigate = useNavigate();

  // 1. Add the loading state (set to true initially)
  const [loading, setLoading] = useState(true);

  // 2. Use useEffect to flip loading to false after 300ms
  useEffect(() => {
    setLoading(true); // Start loading when ID changes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [id]); // Running this when 'id' changes ensures it triggers on every click

  const [quantity, setQuantity] = useState(1); // Default to 1
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000); // Reset button after 3 seconds
  };

  const product = items.find((item) => item.id === parseInt(id));

  if (loading) {
    return <Loader />;
  }

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
        ← Back to Home
      </button>

      
      {product.hasSizes ? (
        <>
        <h2>Product Variations for {product ? product.name : "Item"}</h2>
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
            
          <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Quantity:</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => {
                const val = e.target.value;
                // Allow empty string so user can delete the number to type a new one
                if (val === "") {
                    setQuantity(""); 
                } else {
                    const num = parseInt(val);
                    // Only update if it's a positive number
                    if (num >= 1) setQuantity(num);
                }
              }}
              min="1"
              style={{ 
                width: '60px', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ccc',
                textAlign: 'center' 
              }} 
            />
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={!quantity} // Button turns off if box is empty
            style={{
              padding: '10px 25px',
              backgroundColor: isAdded ? '#28a745' : '#007bff', // Green when added, Blue normally
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: !quantity ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: '0.3s',
              opacity: !quantity ? 0.5 : 1, // Make it look faded when disabled
            }}
          >
            {isAdded ? "Added to Cart ✓" : "Add to Cart"}
          </button>
          </div>

        </>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: "300px", borderRadius: "8px", border: "1px solid #ccc" }} 
          />
          {/* <h3 style={{ color: 'green', marginTop: '15px' }}>Price: ₹500</h3> */}
          <p>Standard quality {product.name} available in stock.</p>

          <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Quantity:</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => {
                const val = e.target.value;
                // Allow empty string so user can delete the number to type a new one
                if (val === "") {
                    setQuantity(""); 
                } else {
                    const num = parseInt(val);
                    // Only update if it's a positive number
                    if (num >= 1) setQuantity(num);
                }
              }}
              min="1"
              style={{ 
                width: '60px', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ccc',
                textAlign: 'center' 
              }} 
            />
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={!quantity} // Button turns off if box is empty
            style={{
              padding: '10px 25px',
              backgroundColor: isAdded ? '#28a745' : '#007bff', // Green when added, Blue normally
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: !quantity ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: '0.3s',
              opacity: !quantity ? 0.5 : 1, // Make it look faded when disabled
            }}
          >
            {isAdded ? "Added to Cart ✓" : "Add to Cart"}
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSizes;