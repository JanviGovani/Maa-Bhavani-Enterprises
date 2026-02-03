import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/Home';
import ProductSizes from './pages/productSizes';
import CartPage from './pages/CartPage';
import { CartProvider } from './components/cartContext';

function App() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <CartProvider>
            <Router>
                {/* Navbar stays visible on every page */}
                <Navbar searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} />
                
                <Routes>
                    <Route path="/" element={<Home searchTerm={searchTerm} />} />
                    <Route path="/product/:id" element={<ProductSizes />} />
                    <Route path="/cart" element={<CartPage />} />
                </Routes>
            </Router>
        </CartProvider>
    );
}

export default App;