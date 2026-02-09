import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore';

import React from 'react';
import { useCart } from '../components/cartContext'; 
import { useNavigate } from 'react-router-dom';
import './cartPage.css';

function CartPage({ addOrder }) {

  const { cart, setCart, removeFromCart } = useCart(); // Add setCart here
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    // 1. Prepare the order data
    const newOrder = {
      time: new Date().toLocaleString(),
      totalItems: cart.length,
      status: "Pending",
      items: cart,
      total: typeof totalAmount !== 'undefined' ? totalAmount : 0, // Ensure total is sent
      timestamp: new Date() // Firestore likes this for sorting
    };

    try {
      // 2. Save to Firebase (Cloud)
      const docRef = await addDoc(collection(db, "orders"), newOrder);

      // 3. Update Local State (So it shows in your Order History page immediately)
      addOrder({ ...newOrder, id: docRef.id });

      // 4. Cleanup and Move
      alert("Order Placed Successfully!");
      setCart([]); // or clearCart() if that's your function name
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