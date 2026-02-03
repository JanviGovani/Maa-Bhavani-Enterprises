import React from 'react';
import { useCart } from '../components/cartContext'; // 👈 Import the hook
import './cartPage.css';

function CartPage() {
  const { cart, removeFromCart } = useCart(); // 👈 Get data and actions

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
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
      )}
    </div>
  );
}

export default CartPage;