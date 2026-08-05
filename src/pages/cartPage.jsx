import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp} from 'firebase/firestore';

import React from 'react';
import { useCart } from '../components/cartContext'; 
import { useNavigate } from 'react-router-dom';
import './cartPage.css';

function CartPage({ addOrder }) {

  const { cart, setCart, removeFromCart } = useCart(); // Add setCart here
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    // Calculate total price dynamically from the cart items
    const calculatedTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    // 1. Prepare the order data
    // 1. Prepare the order data with explicit quantity mapping
    const newOrder = {
      time: new Date().toLocaleString(),
      totalItems: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
      status: "Pending",
      deviceId: localStorage.getItem("customer-device-id"),
      items: cart.map(item => ({
        name: item.name || "Unknown",
        price: item.price || 0,
        size: item.size ?? null,
        image: item.image ?? null,
        quantity: item.quantity || 1  // Explicitly saving quantity here
      })),
      total: calculatedTotal, 
      timestamp: serverTimestamp()
    };

    try {
      // 2. Save to Firebase (Cloud)
      const docRef = await addDoc(collection(db, "orders"), newOrder);

      // 3. Cleanup and Move
      alert("Order Placed Successfully!");
      setCart([]); // Clear cart
      navigate('/order-history');
      
    } catch (e) {
      alert("Error saving order. Please try again.");
      console.error("Firebase Error: ", e);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (<>
        <div className="cart-list">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                {/* Display size if it exists */}
                {item.size && <p>Size: {item.size}</p>}
                {/* Display quantity */}
                <p>Quantity: {item.quantity || 1}</p>
                <button onClick={() => removeFromCart(index)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Place Order Button should be OUTSIDE the loop so it's only shown once */}
          <div className="cart-footer">
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
export default CartPage;