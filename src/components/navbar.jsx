import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './navbar.css'
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa'; // Professional trolley icon
import { useCart } from './cartContext';
import { FaHome, FaInfoCircle, FaPhoneAlt} from 'react-icons/fa';

function Navbar({ showSearchBar,searchTerm, onSearchChange, favorites }){
    const { cart } = useCart(); // Extract cart from context
    
    const [isOpen, setIsOpen] = useState(false); // State to track menu toggle

    const toggleMenu = () => setIsOpen(!isOpen);

    return(
        <nav className="navbar">

            {/* Logo on the left side */}
            <div className="navbar-left">
                <Link to="/">
                    <img src="/MB-logo.png" alt="MB Logo" className="nav-logo" />
                </Link>
            </div>

            {showSearchBar && (
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search items..."
                        className="search-input"
                        value={searchTerm}
                        onChange={onSearchChange}
                        style={{ padding: "0.5rem", fontSize: "1rem" }}
                    />
                </div>
            )}

            {/* Hamburger Icon for Mobile */}
            <div className="menu-icon" onClick={toggleMenu}>
                {isOpen ? <FaTimes size={25} color="white" /> : <FaBars size={25} color="white" />}
            </div>

        <div className={`nav-links ${isOpen ? "active" : ""}`}>
            <Link to="/" onClick={() => setIsOpen(false)}>
                <FaHome style={{ marginRight: '10px' }} /> Home
            </Link>

            <Link to="/about" onClick={() => setIsOpen(false)}>
                <FaInfoCircle style={{ marginRight: '10px' }} /> About
            </Link>

            <Link to="/contact" onClick={() => setIsOpen(false)}>
                <FaPhoneAlt style={{ marginRight: '10px' }} /> Contact
            </Link>

            <Link to="/favorites" className="menu-item" onClick={() => setIsOpen(false)}>
                <span style={{ marginRight: '10px' }}>❤️</span>
                Favorites {favorites && favorites.length > 0 && `(${favorites.length})`}
            </Link>

            {/* Cart Link with Icon and Badge */}
            <Link to="/cart" onClick={() => setIsOpen(false)} style={{ position: 'relative' }}>
                <FaShoppingCart style={{ marginRight: '10px' }} /> 
                Cart
                {cart.length > 0 && (
                <span className="cart-badge">{cart.length}</span>
                )}
            </Link>
        </div>
            
        </nav>
    )
}
export default Navbar;


