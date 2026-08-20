import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp, doc, onSnapshot} from 'firebase/firestore';

import React from 'react';
import { useCart } from '../components/cartContext'; 
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './cartPage.css';

function CartPage({ addOrder }) {

  const { cart, setCart, removeFromCart } = useCart(); // Add setCart here
  const navigate = useNavigate();

  // Add state and timer logic for Price Requests ---
  const [priceRequested, setPriceRequested] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (priceRequested && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000); // 60000ms = 1 minute per tick (change to 1000ms if you want to test fast)
    }
    return () => clearInterval(timer);
  }, [priceRequested, countdown]);

  // Listen for admin price updates in real-time
  useEffect(() => {
    const activeRequestId = localStorage.getItem("activePriceRequestId");
    if (!activeRequestId) return;

    const unsubscribe = onSnapshot(doc(db, "priceRequests", activeRequestId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === "displayed" && data.items) {
          // Update cart items with the prices sent by the admin
          const updatedCart = cart.map(cartItem => {
            const matchedAdminItem = data.items.find(ai => 
              ai.name === cartItem.name && (ai.size || null) === (cartItem.size || null)
            );
            return {
              ...cartItem,
              price: matchedAdminItem ? matchedAdminItem.price : (cartItem.price || 0)
            };
          });
          
          setCart(updatedCart);
          setPriceRequested("displayed"); // Flag to show "Prices are shown above"
        }
      }
    });

    return () => unsubscribe();
  }, [cart, setCart]);

  const handleRequestPrices = async () => {
    if (cart.length === 0) return;
    const userProfile = JSON.parse(localStorage.getItem("user-profile")) || {};

    const priceRequestData = {
      customerName: userProfile.name || "Guest",
      customerMobile: userProfile.mobile || "N/A",
      requestTime: new Date().toLocaleString(),
      status: "pending",
      items: cart.map(item => ({
        name: item.name || "Unknown",
        size: item.size || null,
        quantity: item.quantity || 1
      })),
      timestamp: serverTimestamp()
    };

    try {
      // Saves the request to a new Firestore collection called "priceRequests" for the Admin panel
      const docRef = await addDoc(collection(db, "priceRequests"), priceRequestData);
      
      // Save the request ID and set state
      localStorage.setItem("activePriceRequestId", docRef.id);
      setPriceRequested(true);
    } catch (e) {
      console.error("Error saving price request: ", e);
      alert("Error sending request. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    // Calculate total price dynamically from the cart items
    const calculatedTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    // Add confirmation dialog for total amount
    const userConfirmed = window.confirm(`Total Amount is Rs. ${calculatedTotal}. Do you want to proceed?`);
    if (!userConfirmed) {
      return; // If 'No' / Cancel is clicked, stay on the cart page and do nothing
    }

    const userProfile = JSON.parse(localStorage.getItem("user-profile")) || {};

    // 1. Prepare the order data with explicit quantity mapping
    const newOrder = {
      time: new Date().toLocaleString(),
      totalItems: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
      status: "Pending",
      deviceId: localStorage.getItem("customer-device-id"),
      customerName: userProfile.name || "Guest",
      customerMobile: userProfile.mobile || "N/A",
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
                <p>Price: ₹{item.price || 0}</p>
                <button onClick={() => removeFromCart(index)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Place Order Button should be OUTSIDE the loop so it's only shown once */}
          <div className="cart-footer" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>

            {/* Update message display based on status */}
            {priceRequested !== "displayed" && !priceRequested ? (
              <button 
                onClick={handleRequestPrices}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#ffc107', 
                  color: '#000', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold' 
                }}
              >
                Request Prices
              </button>
            ) : priceRequested === "displayed" ? (
              <span style={{ fontWeight: 'bold', color: 'green' }}>
                Prices are shown above
              </span>
            ) : (
              <span style={{ fontWeight: 'bold', color: '#333' }}>
                {countdown > 0 
                  ? `Request Successful! Prices will be shown in ${countdown} minutes` 
                  : "Prices are shown above"}
              </span>
            )}
        </div>
        </>
      )}
    </div>
  );
}
export default CartPage;