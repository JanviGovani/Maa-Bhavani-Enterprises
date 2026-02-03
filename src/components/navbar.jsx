import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './navbar.css'
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa'; // Professional trolley icon
import { useCart } from './cartContext';

function Navbar({ showSearchBar,searchTerm, onSearchChange }){
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
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>

            <div className="cart-icon-container" title="View Cart">
                <Link to="/cart" onClick={() => setIsOpen(false)} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <FaShoppingCart size={22} color="white" />
                    {cart.length > 0 && (
                    <span className="cart-badge">{cart.length}</span>
                    )}
                </Link>
            </div>
        </div>
            
        </nav>
    )
}
export default Navbar;


