import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
// 1. IMPORT signOut from firebase/auth and auth from your firebase config
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Admin = () => {
  const [orders, setOrders] = useState([]);

  // 1. Add feedback state
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch orders in real-time
  useEffect(() => {
    // 1. Set up a real-time listener
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const orderData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by timestamp (newest first)
      setOrders(orderData.sort((a, b) => b.timestamp - a.timestamp));
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // 2. Fetch feedbacks in real-time (Added as-is)
  useEffect(() => {
    const unsubscribeFeedbacks = onSnapshot(collection(db, "feedbacks"), (snapshot) => {
      const feedbackData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedbacks(feedbackData.sort((a, b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0)));
    });

    return () => unsubscribeFeedbacks();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteDoc(doc(db, "orders", orderId));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Live Admin Dashboard</h2>
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Order ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Customer Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Mobile Number</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date & Time</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Items</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quantity</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.id.slice(0, 5)}...</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.customerName || "Guest"}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.customerMobile || "N/A"}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.time}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {order.items?.map(item => item.name).join(', ')}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {order.items?.map(item => `${item.quantity || item.qty || 1}`).join(', ')}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                {order.status}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <select onChange={(e) => updateStatus(order.id, e.target.value)} value={order.status}>
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Completed">Completed</option>
                </select>
                <button onClick={() => deleteOrder(order.id)} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- FEEDBACK SECTION --- */}
      <h2 style={{ marginTop: '40px' }}>Customer Feedbacks</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Customer Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Mobile Number</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Message</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                No feedback received yet.
              </td>
            </tr>
          ) : (
            feedbacks.map(fb => (
              <tr key={fb.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{fb.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{fb.mobile}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{fb.message}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {fb.time || (fb.timestamp?.toDate ? fb.timestamp.toDate().toLocaleString() : "N/A")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
};

export default Admin;