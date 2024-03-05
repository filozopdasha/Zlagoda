import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginStyles.css';
function Login() {



    return (
        <div className="main">
            <div className="full-form">
                <form>
                    <div className="line">
                        <label htmlFor="email" className="line-heading">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            className="input-field-login"
                        />
                    </div>
                    <div className="line">
                        <label htmlFor="password" className="line-heading">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="input-field-login"
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Log in
                    </button>
                    <div className="account-actions">
                        <Link to="/signup" className="create-account-button">
                            Create Account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;