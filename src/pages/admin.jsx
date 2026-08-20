import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { getDocs, collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
// 1. IMPORT signOut from firebase/auth and auth from your firebase config
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Admin = () => {
  const [orders, setOrders] = useState([]);

  // 1. Add feedback state
  const [feedbacks, setFeedbacks] = useState([]);

  // --- ADD START: State and listener for price requests ---
  const [priceRequests, setPriceRequests] = useState([]);
  const [priceInputs, setPriceInputs] = useState({}); // Tracks input values for each item row

  useEffect(() => {
    const unsubscribeRequests = onSnapshot(collection(db, "priceRequests"), (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPriceRequests(requestsData);
    });
    return () => unsubscribeRequests();
  }, []);

  const handlePriceChange = (requestId, itemIndex, value) => {
    setPriceInputs(prev => ({
      ...prev,
      [`${requestId}-${itemIndex}`]: value
    }));
  };

  const handleDisplayPrices = async (request) => {
    // Map items and attach the individual price entered by the admin
    const updatedItems = request.items.map((item, idx) => ({
      ...item,
      price: Number(priceInputs[`${request.id}-${idx}`]) || 0
    }));

    const reqRef = doc(db, "priceRequests", request.id);
    await updateDoc(reqRef, {
      status: "displayed",
      items: updatedItems
    });
    alert("Prices displayed to customer successfully!");
  };

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

      {/* --- PRICE REQUESTS SECTION (Placed between Orders and Feedbacks) --- */}
      <h2 style={{ marginTop: '40px' }}>Price Requests</h2>
      {priceRequests.length === 0 ? (
        <p>No price requests found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <thead>
            <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Customer Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Phone Number</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date & Time</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Item & Size</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quantity</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timer</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action (Enter Price)</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Display</th>
            </tr>
          </thead>
          <tbody>
            {priceRequests.map((req) => {
              const itemCount = req.items ? req.items.length : 1;
              const isDisplayed = req.status === "displayed";

              return req.items.map((item, itemIndex) => (
                <tr key={`${req.id}-${itemIndex}`}>
                  {/* Columns 1, 2, 3: Customer details and timestamp are spanned across item rows */}
                  {itemIndex === 0 && (
                    <>
                      <td rowSpan={itemCount} style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'middle', fontWeight: 'bold' }}>
                        {req.customerName}
                      </td>
                      <td rowSpan={itemCount} style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'middle' }}>
                        {req.customerMobile}
                      </td>
                      <td rowSpan={itemCount} style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'middle' }}>
                        {req.requestTime}
                      </td>
                    </>
                  )}

                  {/* Column 4: Item with size */}
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {item.name} {item.size ? `(Size: ${item.size})` : ""}
                  </td>

                  {/* Column 5: Quantity */}
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {item.quantity}
                  </td>

                  {/* Column 6: Status */}
                  {itemIndex === 0 && (
                    <td rowSpan={itemCount} style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'middle', fontWeight: 'bold', color: isDisplayed ? 'green' : 'orange' }}>
                      {req.status || "pending"}
                    </td>
                  )}

                  {/* Column 7: Timer */}
                  {itemIndex === 0 && (
                    <td rowSpan={itemCount} style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'middle' }}>
                      {isDisplayed ? "Paused (Displayed)" : "60 mins (Running)"}
                    </td>
                  )}

                  {/* Column 8: Action (Individual Price Input Boxes) */}
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <input 
                      type="number" 
                      placeholder="Enter price" 
                      value={priceInputs[`${req.id}-${itemIndex}`] ?? (item.price || "")}
                      onChange={(e) => handlePriceChange(req.id, itemIndex, e.target.value)}
                      style={{ width: '90px', padding: '4px' }}
                    />
                  </td>

                  {/* Column 9: Display Button */}
                  {itemIndex === 0 && (
                    <td rowSpan={itemCount} style={{ padding: '10px', border: '1px solid #ddd', verticalAlign: 'middle' }}>
                      <button 
                        onClick={() => handleDisplayPrices(req)}
                        style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}
                      >
                        Display
                      </button>
                    </td>
                  )}
                </tr>
              ));
            })}
          </tbody>
        </table>
      )}

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