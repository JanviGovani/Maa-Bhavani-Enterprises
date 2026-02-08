import React from 'react';
import './orderHistory.css';

const OrderHistory = ({ orderHistory, updateOrderStatus }) => {
  return (
    <div className="history-container">
      <h2>Your Orders</h2>
      {orderHistory.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orderHistory.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>Order ID: <strong>#{order.id}</strong></span>
              <span className={`status-badge ${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                {order.status}
              </span>
            </div>
            
            <div className="order-details">
              <p>Placed on: {order.time}</p>
              <p>Items: {order.totalItems} | Quantity: {order.totalQuantity}</p>
            </div>

            {/* Status Tracking Bar */}
            <div className="status-track">
              <div className={`step ${order.status !== 'Pending' ? 'active' : ''}`}>Confirmed</div>
              <div className={`step ${order.status === 'Out for Delivery' || order.status === 'Delivered' ? 'active' : ''}`}>Shipping</div>
              <div className={`step ${order.status === 'Delivered' ? 'active' : ''}`}>Delivered</div>
            </div>

            {/* ADMIN ONLY BUTTON: Simulates the shipping process */}
            {order.status === 'Pending' && (
              <button 
                className="admin-ship-btn"
                onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
              >
                🚚 Dispatch Order (Admin)
              </button>
            )}

            {/* Show button ONLY if not delivered yet */}
            {order.status !== 'Delivered' && (
              <div className="action-area">
                <button 
                  className="received-btn"
                  onClick={() => updateOrderStatus(order.id, 'Delivered')}
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