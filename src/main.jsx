import React, { useState} from 'react'
import {StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Home from './pages/home.jsx'
import ProductSizes from './pages/productSizes.jsx'; // Ensure the filename matches exactly
import { CartProvider } from './components/cartContext.jsx';
import CartPage from './pages/cartPage.jsx';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import Footer from './components/footer.jsx'

const RootComponent = () => {
  // 2. Move search state here
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => { 
    setSearchTerm(e.target.value);
  };

  return (
    <CartProvider>
      <Router>
        {/* 3. Pass the props to Navbar here */}
        <Navbar 
          showSearchBar={true} 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
        <Routes>
          {/* 4. Pass searchTerm to App so it can highlight items */}
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductSizes />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        <Footer/>
      </Router>
    </CartProvider>
  );
} 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>
  
)
