import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import '../css/login.css';
import { userContext } from "./App";
import Cookies from 'js-cookie';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUserData } = useContext(userContext);

    async function checkIFUserExists() {
        const response = await fetch(`http://localhost:3000/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        }
        );

        if (response.ok) {
            const { accessToken, user } = await response.json();
            Cookies.set('accessToken', accessToken, { expires: 0.0104, sameSite: 'Lax' });
            setUserData(user);
            localStorage.setItem("currentUser", JSON.stringify(user));
            navigate(`/home`);
        } else {
            try {
                const error = await response.json();
                alert(error.error || 'Login failed');
            } catch {
                alert('Login failed');
            }
        }
    }


    return (
        <div>
            <div className="login-container">
                <input
                    name="email"
                    placeholder="email"
                    className="login-input"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="login-input"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-button" onClick={checkIFUserExists}>
                    Login
                </button>
            </div>
            <button className="switch-signup" onClick={() => navigate('/register')}>
                don't have an account yet?
            </button>
        </div>
    );
}

export default Login;