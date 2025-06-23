import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useState } from 'react';
import Home from './HomePage';
import About from './About';
import Branches from './Branches';
import Contact from './Contact';
import Login from './auth/LogIn';
import Signup from './auth/SignUp';
import Profile from './Profile';
import NotFound from './NotFound';
import MainLayout from './MainLayout';
import MyLessons from './MyLessons';
import RegisterLesson from './RegisterLesson';
import UserManagement from './ItemManagement ';
import Management from './Management';
import Messages from './Messages'
import SendMessages from './SendMessages'
import RequestLesson from './RequestLesson';       
import TeacherRequests from './TeacherRequests';    

export const userContext = createContext();

export default function App() {
    const [userData, setUserData] = useState(localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")) : null);
    return (
        <userContext.Provider value={{ userData, setUserData }}>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="/home" replace />} />
                    <Route path="home" element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="branches" element={<Branches />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="/my-lessons" element={<MyLessons />} />
                    <Route path=":username/my-lessons" element={<MyLessons />} />
                    <Route path=":username/register-lesson" element={<RegisterLesson />} />
                    <Route path=":username/request-lesson" element={<RequestLesson />} />           {/* ← הוסף את זה */}
                    <Route path=":username/requests" element={<TeacherRequests />} />       {/* ← הוסף את זה */}
                    <Route path=":username/students" element={<UserManagement userType="students" />} />
                    <Route path=":username/teachers" element={<UserManagement userType="teachers" />} />
                    <Route path=":username/pools" element={<UserManagement userType="pools" />} />
                    <Route path=":username/management" element={<Management />} />
                    <Route path=":username/management/messages" element={<Messages/>} />
                     <Route path=":username/management/send-messages" element={<SendMessages/>} />
                    <Route path=":username" element={<Profile />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </userContext.Provider>
    );
}
