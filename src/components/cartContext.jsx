//This file will act as the brain that remembers what's in the cart across all pages.
//This is the "Engine." It doesn't show anything on the screen; it just stores the data in the background.

import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    return savedCart ? JSON.parse(savedCart) : [];
  }); 

  // Use useEffect to save the cart whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (item) => {
    setCart((prev) => {
      // Ensure the incoming item has a quantity, defaulting to 1 if missing
      const quantityToAdd = Number(item.quantity) || 1;
      
      // Check if item already exists in cart (optional: match by name or id)
      const existingIndex = prev.findIndex((cartItem) => cartItem.name === item.name && cartItem.size === item.size);

      if (existingIndex > -1) {
        // If it exists, add to the quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (Number(updated[existingIndex].quantity) || 1) + quantityToAdd
        };
        return updated;
      } else {
        // If it's new, add it with the correct quantity
        return [...prev, { ...item, quantity: quantityToAdd }];
      }
    });
  };

  // Logic to remove items by their index
  const removeFromCart = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart , setCart}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);