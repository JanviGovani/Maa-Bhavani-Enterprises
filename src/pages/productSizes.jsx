import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Add useState and useEffect
import Loader from '../components/loader';           // Ensure Loader is imported
import { useCart } from '../components/cartContext';

const items = [
  { id: 1, name: "Thunder Hose Pipe", hasSizes: true, image: "/thunder_hose_pipe.png" },
  { id: 2, name: "Canvas Hose Pipes", hasSizes: false, image: "/canvas_hose_pipe.png" },
  { id: 3, name: "Section Pipes", hasSizes: true, image: "/section-pipe.png" },
  { id: 4, name: "Butyl Water Proofing Tapes for ceiling(SHED) repairs", hasSizes: true, image: "/butyl-waterproofing-tape.png" },
  { id: 5, name: "Tractor Pumps", hasSizes: false, image: "/tractor-pump.png" },
  { id: 6, name: "Water Circulation Pumps", hasSizes: false, image: "/water-circulation-pump.png" },
  { id: 7, name: "Rubber Flange Washers", hasSizes: false, image: "/rubber-flange-washer.png" },
  { id: 8, name: "Square CI Flanges", hasSizes: false, image: "/square-ci-flange.png" },
  { id: 9, name: "Round CI Flanges", hasSizes: true, image: "/round-ci-flange.png" },
  { id: 10, name: "Bends", hasSizes: true, image: "/bend.png" },
  { id: 11, name: "Grove Bends", hasSizes: false, image: "/grove-bend.png" },
  { id: 12, name: "CI Hose Collars", hasSizes: true, image: "/ci-hose-collar.png" },
  { id: 14, name: "Hose Clamps", hasSizes: false, image: "/hose-clamp.png" },
  { id: 15, name: "Worm Drive Clamps", hasSizes: true, image: "/worm-drive-clamp.png" },
  { id: 16, name: "All Agriculture Pipe Clamps", hasSizes: false, image: "/all-agriculture-pipe-clamp.png" },
  { id: 17, name: "Niko Clamps", hasSizes: false, image: "/niko-clamp.png" },
  { id: 18, name: "CPVC Clamps", hasSizes: false, image: "/cpvc-clamp.png" },
  { id: 19, name: "Nail Clamps", hasSizes: true, image: "/nail-clamp.png" },
  { id: 20, name: "Agriculture Pump Foot Valves CI", hasSizes: false, image: "/agriculture-pump-foot-valve-ci.png" },
  { id: 21, name: "Ball Model A/T N.R. Valves", hasSizes: true, image: "/Ball-Model-A.T-N.R-Valves-1.png" }
];

const ProductSizes = () => {
  const { addToCart, cart } = useCart();

  const { id } = useParams(); // Gets the ID of the clicked product
  const navigate = useNavigate();

  // 1. Add the loading state (set to true initially)
  const [loading, setLoading] = useState(true);

  // This is a placeholder array. In a real app, you'd filter this based on the ID.
  const sizeVariations = [
    { sizeId: 1, label: "Size-2.5", img: "https://via.placeholder.com/150?text=Size-2.5" },
    { sizeId: 2, label: "Size-3",   img: "https://via.placeholder.com/150?text=Size-3" },
    { sizeId: 3, label: "Size-3.5", img: "https://via.placeholder.com/150?text=Size-3.5" },
    { sizeId: 4, label: "Size-4",   img: "https://via.placeholder.com/150?text=Size-4" },
  ];

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

  const product = items.find((item) => item.id === parseInt(id));
  
  const [selectedSize, setSelectedSize] = useState(() => {
    if (!product || !product.hasSizes) return sizeVariations[0]?.label || "";
    // Find any cart item belonging to this product ID
    const existingProductInCart = cart.find(ci => ci.id.toString().startsWith(product.id.toString()));
    if (existingProductInCart) {
      // Extract the size suffix from the cart item ID (e.g., if ID is "1Size-3", extract "Size-3")
      const matchedVariant = sizeVariations.find(v => existingProductInCart.id === product.id + v.label);
      if (matchedVariant) return matchedVariant.label;
    }
    return sizeVariations[0].label; // Fallback to first size
  }); 

  // Sync quantity and existing cart state whenever the product, size, or global cart updates
  useEffect(() => {
    if (!product) return;
    
    // Ensure the ID matching logic mirrors home.jsx (uses "Standard" if no sizes or sizes aren't selected yet)
    let cartItemId;
    if (product.hasSizes) {
      if (!selectedSize) {
        setQuantity(1);
        return;
      }
      cartItemId = product.id + selectedSize;
    } else {
      cartItemId = product.id + "Standard"; // Must match handleHomeAddToCart suffix
    }

    const existingCartItem = cart.find(ci => ci.id === cartItemId);

    if (existingCartItem) {
      setQuantity(existingCartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [id, selectedSize, cart, product]);

  const handleAddToCart = () => {
    if (product.hasSizes && !selectedSize) {
        alert("Please select a size first!");
        return;
    }

    const currentSize = selectedSize || "Standard";
    const cartItemId = product.id + currentSize;
    
    // Create the exact item payload using the input box's quantity value directly
    const itemToAdd = {
        name: product.name,
        image: product.image,
        size: currentSize,
        quantity: Number(quantity) || 1, // Directly use whatever number is typed in the box
        id: cartItemId
    };

    // Use addToCart to set or overwrite the item with the exact quantity specified
    addToCart(itemToAdd, 0); // Pass 0 or handle it as an absolute set in context if needed

    setIsAdded(true);
    // OPTIONAL: Remove or keep this timeout. If you want the green visual feedback 
    // to trigger temporarily on click while 'isInCart' keeps it green permanently, 
    // you can leave it, or remove it so it switches instantly.
    setTimeout(() => setIsAdded(false), 2000); 
  };
  
  if (loading) {
    return <Loader />;
  }

  // Check if current item/variation is already in the cart
  const currentSize = product.hasSizes ? (selectedSize || "") : "Standard";
  const cartItemId = product.id + currentSize;
  const isInCart = cart.some(ci => ci.id === cartItemId);

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
              <div key={variant.sizeId} 
              onClick={() => setSelectedSize(variant.label)} // Set the size on click
              style={{ 
                border: selectedSize === variant.label ? '2px solid #007bff' : '1px solid #ddd', // Blue border if selected 
                borderRadius: '8px', 
                padding: '10px',
                width: '180px',
                cursor: 'pointer',
                backgroundColor: selectedSize === variant.label ? '#f0f7ff' : 'white', // Light blue background if selected
                color: '#000000', // Forces text inside the box to stay black on all devices
                transition: '0.2s all ease-in-out'
              }}>
                <img 
                  src={variant.img} 
                  alt={variant.label} 
                  style={{ width: "100%", borderRadius: "4px" }} 
                />
                <h4 style={{ color: '#333333', margin: '10px 0 0 0' }}>{variant.label}</h4>
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
              backgroundColor: (isAdded || isInCart) ? '#28a745' : '#007bff', // Green when added, Blue normally
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: !quantity ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: '0.3s',
              opacity: !quantity ? 0.5 : 1, // Make it look faded when disabled
            }}
          >
            {(isAdded || isInCart) ? "Added to Cart ✓" : "Add to Cart"}
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
            {(isAdded || isInCart) ? "Added to Cart ✓" : "Add to Cart"}
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSizes;