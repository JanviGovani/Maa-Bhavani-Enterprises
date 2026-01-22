import React from 'react'
import {Link} from 'react-router-dom'
import './navbar.css'
function Navbar({ showSearchBar,searchTerm, onSearchChange }){
    
    return(
        <nav className="navbar">

            {/* 1. Placeholder to push search to center */}
            <div className="nav-spacer"></div>

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
            <Link to="/" >App</Link> 
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
        </div>
            
        </nav>
    )
}
export default Navbar;


