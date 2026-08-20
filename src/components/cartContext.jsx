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
  
  const addToCart = (item, amount = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((cartItem) => 
        cartItem.id === item.id || (cartItem.name === item.name && cartItem.size === item.size)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = Number(updated[existingIndex].quantity) || 1;
        
        // Always calculate the new quantity using the relative 'amount' (+1 or -1) 
        // unless an absolute override is explicitly intended.
        // If amount is 0, use item.quantity as an absolute override. Otherwise, add amount relative.
        const newQuantity = amount === 0 ? (item.quantity !== undefined ? item.quantity : currentQty) : currentQty + amount;

        if (newQuantity <= 0) {
          return updated.filter((_, index) => index !== existingIndex);
        }

        updated[existingIndex] = {
          ...updated[existingIndex],
          ...item,
          quantity: newQuantity
        };
        return updated;
      } else {
        // Use item.quantity if provided, otherwise fallback to amount or 1
        const initialQty = item.quantity !== undefined ? item.quantity : (amount > 0 ? amount : 1);
        return [...prev, { ...item, quantity: initialQty }];
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