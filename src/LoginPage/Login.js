import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginStyles.css';
import bcrypt from "bcryptjs";

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [DbPassword, setDbPassword] = useState(null);

    useEffect(() => {
        if (id) {
            fetchEmployeeData();
        }
    }, [id]);

    const fetchEmployeeData = async () => {
        try {
            const response = await fetch(`http://localhost:8081/get-single-employee/${id}`);
            if (!response.ok) {
                throw new Error('Employee not found');
            }

            const employeeData = await response.json();
            if (employeeData.length === 0) {
                throw new Error('Employee not found');
            }

            setDbPassword(employeeData[0].password);
            localStorage.setItem('role', employeeData[0].empl_role);
            localStorage.setItem('id', employeeData[0].id_employee)

        } catch (error) {
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!id) {
                throw new Error('Please enter your ID');
            }

            const passwordMatch = await bcrypt.compare(password, DbPassword);

            if (!passwordMatch) {
                throw new Error('Incorrect password or ID!');
            }

            navigate('/products');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="main">
            <div className="full-form">
                <form onSubmit={handleSubmit}>
                    <div className="line">
                        {error && <p className="error-message">{error}</p>}
                    </div>
                    <div className="line">
                        <label htmlFor="email" className="line-heading">
                            <strong>ID</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your ID"
                            name="id"
                            className="input-field-login"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
