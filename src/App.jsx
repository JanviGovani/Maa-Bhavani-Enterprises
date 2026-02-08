import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  // FIX: Added the missing favorites state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("my-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("my-favorites", JSON.stringify(favorites));
  }, [favorites]); // This runs every time the 'favorites' array changes

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

  const removeFromFavorites = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  // Order History State
  const [orderHistory, setOrderHistory] = useState(() => {
    const savedOrders = localStorage.getItem("order-history");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Sync orders to LocalStorage
  useEffect(() => {
    localStorage.setItem("order-history", JSON.stringify(orderHistory));
  }, [orderHistory]);

  // Function to add a new order (Called from CartPage)
  const addOrder = (newOrder) => {
    setOrderHistory(prev => [newOrder, ...prev]); // Most recent order at the top
  };

  // Function to update status (Admin or User click)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrderHistory(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
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
          <Route path="/favorites" 
          element={<Favorites favorites={favorites}
          removeFromFavorites={removeFromFavorites}/>} />
          <Route path="/cart" element={
            <CartPage addOrder={addOrder}/>
            } />
            <Route path="/order-history" element={
              <OrderHistory 
                orderHistory={orderHistory} 
                updateOrderStatus={updateOrderStatus} 
              />
            } />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;