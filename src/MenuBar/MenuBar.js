import React, {useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
import './MenuBarStyles.css';

const MenuBar = () => {
    const [role, setRole] = useState('');

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    return (
        <header className="menu-bar">
            <nav className="navbar">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <span className="zlagoda">Zlagoda</span>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/products" className="nav-link" activeClassName="active">Products</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/categories" className="nav-link" activeClassName="active">Categories</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/cards" className="nav-link" activeClassName="active">Customer Cards</NavLink>
                    </li>
                    {role === "Manager" && (
                        <li className="nav-item">
                            <NavLink to="/employees" className="nav-link" activeClassName="active">Employees</NavLink>
                        </li>
                    )}
                    <li className="nav-item">
                        <NavLink to="/checks" className="nav-link" activeClassName="active">Checks</NavLink>
                    </li>
                    {role === "Cashier" && (
                        <li className="nav-item">
                            <NavLink to="/employees" className="nav-link" activeClassName="active">My profile</NavLink>
                        </li>
                    )}
                    <li className="nav-item">
                        <NavLink to="/store-products" className="nav-link" activeClassName="active">Store
                            Products</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/" className="nav-link" activeClassName="active">Log out</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default MenuBar;
