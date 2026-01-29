import React from 'react'
import {Link} from 'react-router-dom'
import './navbar.css'
function Navbar({ showSearchBar,searchTerm, onSearchChange }){
    
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
                        value={searchTerm}
                        onChange={onSearchChange}
                        style={{ padding: "0.5rem", width: "300px", fontSize: "1rem" }}
                    />
                </div>
            )}
        <div className="nav-links">
            <Link to="/" >Home</Link> 
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
        </div>
            
        </nav>
    )
}
export default Navbar;


