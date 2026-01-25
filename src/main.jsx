import React, { useState} from 'react'
import {StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import About from "./components/about";
import Contact from "./components/contact";
import Footer from './components/footer'
import ProductSizes from './productSizes'; // Ensure the filename matches exactly

const RootComponent = () => {
  // 2. Move search state here
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
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
      </Routes>
      <Footer/>
    </Router>
  );
} 

createRoot(document.getElementById('root')).render(
  <RootComponent />
)
