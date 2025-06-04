import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useState } from 'react';
import Home from './HomePage';
import About from './About';
import Branches from './Branches';
import Contact from './Contact';
import Login from './LogIn';
import Signup from './SignUp';
import Profile from './Profile';
import NotFound from './NotFound';
import MainLayout from './MainLayout';
import UserDashboard from './UserDashboard';

export const userContext = createContext();

export default function App() {
    const [userData, setUserData] = useState(localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")) : null);
    return (
        <userContext.Provider value={{ userData, setUserData }}>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/" element={<MainLayout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="branches" element={<Branches />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
                <Route path="/:username/*" element={<UserDashboard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </userContext.Provider>
    );
}
