import React from 'react';
import './menu.css';
import AuthService from '../services/authenticationService';

const Menu = ({ setSelectedItem, menuItems, isAuthenticated }) => {
    const handleLogout = () => {
        AuthService.doLogout();
        window.location.reload(); // Reload the page after logout to reset the state
    };

    return (
        <nav className="menu">
            {menuItems.map((menuItem) => (
                <button key={menuItem.id} onClick={() => setSelectedItem(menuItem.id)}>
                    {menuItem.name}
                </button>
            ))}
            {isAuthenticated && (
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            )}
        </nav>
    );
}

export default Menu;