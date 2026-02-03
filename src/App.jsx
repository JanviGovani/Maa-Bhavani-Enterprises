import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/cartContext';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import ProductSizes from './pages/productSizes';
import CartPage from './pages/cartPage';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  // FIX: Added the missing favorites state
  const [favorites, setFavorites] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // FIX: Added the logic to add/remove favorites
  const toggleFavorite = (item) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === item.id)
        ? prev.filter((fav) => fav.id !== item.id)
        : [...prev, item]
    );
  };

  return (
    <CartProvider>
      <Router>
        <Navbar 
          showSearchBar={true} 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
          favorites={favorites} // Passing it here
        />
        <Routes>
          <Route path="/" element={
            <Home 
              searchTerm={searchTerm} 
              favorites={favorites} 
              toggleFavorite={toggleFavorite} 
            />
          } />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductSizes />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;