import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import './orderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders in real-time from Firebase
  useEffect(() => {
    // Get or create a unique device identifier for this customer
    let deviceId = localStorage.getItem("customer-device-id");
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36.substring(2, 9));
      localStorage.setItem("customer-device-id", deviceId);
    }

    // Query only orders belonging to this specific device ID
    const q = query(collection(db, "orders"), where("deviceId", "==", deviceId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort newest first
      setOrders(orderData.sort((a, b) => b.timestamp?.toMillis?.() - a.timestamp?.toMillis?.() || 0));
    });

    return () => unsubscribe();
  }, []);

  // Function for customer to mark order as delivered/received
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  return (
    <div className="history-container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>Order ID: <strong>#{order.id.slice(0, 6)}...</strong></span>
              <span className={`status-badge ${order.status?.toLowerCase().replace(/\s/g, '-')}`}>
                {order.status}
              </span>
            </div>
            
            <div className="order-details">
              <p>Placed on: {order.time}</p>
              <p>Items & Quantities: {order.items?.map(item => `${item.name} (x${item.quantity || 1})`).join(', ')}</p>
            </div>

            {/* Status Tracking Bar */}
            <div className="status-track">
              <div className={`step ${order.status !== 'Pending' ? 'active' : ''}`}>Confirmed</div>
              <div className={`step ${order.status === 'Out for Delivery' || order.status === 'Completed' || order.status === 'Delivered' ? 'active' : ''}`}>Shipping</div>
              <div className={`step ${order.status === 'Completed' || order.status === 'Delivered' ? 'active' : ''}`}>Delivered</div>
            </div>

            {/* Customer Action: Mark as Received only if not already completed/delivered */}
            {order.status !== 'Completed' && order.status !== 'Delivered' && (
              <div className="action-area">
                <button 
                  className="received-btn"
                  onClick={() => updateOrderStatus(order.id, 'Completed')}
                >
                  Mark as Received
                </button>
                <p className="hint-text">(Click this once order is received to update status)</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;