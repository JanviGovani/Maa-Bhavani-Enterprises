import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const Admin = () => {
  const [orders, setOrders] = useState([]);

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

  const updateStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteDoc(doc(db, "orders", orderId));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Live Admin Dashboard</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Order ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Items</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.id.slice(0, 5)}...</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {order.items?.map(item => `${item.name} (x${item.quantity || 1})`).join(', ')}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>₹{order.total}</td>
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
    </div>
  );
};

export default Admin;