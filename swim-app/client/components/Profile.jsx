import React, { useState, useEffect, useContext } from "react";
import { fetchData } from "../js-files/GeneralRequests";
import { userContext } from './App';
import useHandleError from "./useHandleError";
import Update from "./Update";
import { profileFields, profileValidationRules } from '../structures/ProfileStructure';

import "../styles/Profile.css";

function UserProfile() {
    const { userData, setUserData } = useContext(userContext); // הוספת setUserData
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const { handleError } = useHandleError();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (userData && userData.user_id) {
                try {
                    let response = await fetchData("users", userData.user_id, handleError);
                    if (response) {
                        setUserDetails(response[0]);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setLoading(false);
                }
            }
        };

        fetchUserProfile();
    }, [userData]);

    const getUserTypeText = (typeId) => {
        switch (typeId) {
            case 1: return "מנהל מערכת";
            case 2: return "מורה";
            case 3: return "תלמיד";
            default: return "לא ידוע";
        }
    };

    const updateProfile = (updatedData) => {
        setUserDetails(prevDetails => ({
            ...prevDetails,
            ...updatedData
        }));

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && currentUser.user_id === updatedData.id) {
            const updatedUser = {
                ...currentUser,
                name: updatedData.name || currentUser.name,
                email: updatedData.email || currentUser.email
            };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            setUserData(updatedUser);
        }
    };

    if (loading) {
        return <div className="loading">טוען...</div>;
    }

    if (!userDetails) {
        return <div className="error">לא ניתן לטעון את הפרופיל</div>;
    }

    const editableFields = {
        id: userDetails.user_id || userDetails.id,
        name: userDetails.name,
        email: userDetails.email
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>הפרופיל האישי שלי</h1>
            </div>

            <div className="profile-content">
                <div className="profile-section">
                    <h2>פרטים אישיים</h2>
                    <div className="profile-field">
                        <strong>שם:</strong> {userDetails.name}
                    </div>
                    <div className="profile-field">
                        <strong>אימייל:</strong> {userDetails.email}
                    </div>
                    <div className="profile-field">
                        <strong>סוג משתמש:</strong> {getUserTypeText(userDetails.type_id)}
                    </div>
                </div>

                <div className="profile-actions">
                    <Update
                        item={editableFields}
                        type="users"
                        updateDisplay={updateProfile}
                        nameButton="עריכת פרופיל"
                        userType={userData?.type_name}
                        keys={profileFields}
                        validationRules={profileValidationRules}
                    />

                </div>
            </div>
        </div>
    );
}

export default UserProfile;
