import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route,useNavigate, useLocation } from 'react-router-dom';
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
import AdminLogin from './pages/adminLogin';
import { ADMIN_EMAILS } from './adminConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// 3. Create a Protected Admin Wrapper component
function ProtectedAdminRoute() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return user ? <Admin /> : <AdminLogin onLoginSuccess={(u) => setUser(u)} />;
}

// Helper component to handle PWA standalone redirect to admin
function AdminRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    // If opened as an installed app on your device and sitting at the root, jump to admin
    if (isStandalone && (location.pathname === '/' || location.pathname === '')) {
      navigate('/admin');
    }
  }, [navigate, location]);

  return null;
}

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
          <Route path="/admin" element={<ProtectedAdminRoute />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;