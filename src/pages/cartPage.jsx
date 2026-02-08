import React from 'react';
import { useCart } from '../components/cartContext'; 
import { useNavigate } from 'react-router-dom';
import './cartPage.css';

function CartPage({ addOrder }) {

  const { cart, setCart, removeFromCart } = useCart(); // Add setCart here
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
  if (cart.length === 0) return;

  const newOrder = {
    id: Math.floor(100000 + Math.random() * 900000).toString(),
    time: new Date().toLocaleString(),
    totalItems: cart.length,
    totalQuantity: cart.length, // Or use a sum if you have quantity per item
    status: "Pending", 
    items: [...cart]   
  };

  addOrder(newOrder); // Calls the function in App.jsx
  setCart([]);        // Clears the context and LocalStorage automatically
  navigate('/order-history');
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