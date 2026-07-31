import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/cartContext';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import ProductSizes from './pages/productSizes';
import CartPage from './pages/cartPage';
import Favorites from './pages/favorites'; 
import OrderHistory from './pages/orderHistory';
import Admin from './pages/admin';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Favorites State (kept as is)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("my-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("my-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFavorite = (item) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === item.id)
        ? prev.filter((fav) => fav.id !== item.id)
        : [...prev, item]
    );
  };

  const removeFromFavorites = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  return (
    <CartProvider>
      <Router>
        <Navbar 
          showSearchBar={true} 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
          favorites={favorites} 
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
          <Route path="/favorites" 
          element={<Favorites favorites={favorites}
          removeFromFavorites={removeFromFavorites}/>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;