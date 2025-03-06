import './login.css';
import React, { useEffect } from 'react';
import AuthService from '../services/authenticationService';

const LoginKeycloak = ({ handleLoginSubmit }) => {

    useEffect(() => {
        handleLoginSubmit()
    }, []);

    return (
        <div className="login-container">
            <h2>Login Keycloak: Du bist schon angemeldet.</h2>
        </div>
    );
}

export default LoginKeycloak;