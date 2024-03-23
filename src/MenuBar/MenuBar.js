import React from "react";
import { NavLink } from "react-router-dom";
import './MenuBarStyles.css';

const MenuBar = () => {
    return (
        <header className="menu-bar">
            <nav className="navbar">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <span className="zlagoda">Zlagoda</span>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/" className="nav-link" activeClassName="active">Login</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/products" className="nav-link" activeClassName="active">Products</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/employees" className="nav-link" activeClassName="active">Employees</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default MenuBar;
