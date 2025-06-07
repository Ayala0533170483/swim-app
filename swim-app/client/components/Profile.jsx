import React, { useState, useEffect, useContext } from "react";
import { fetchData } from "../js-files/GeneralRequests";
import { userContext } from './App';
import useHandleError from "./useHandleError";
import Update from "./Update";
import "../styles/Profile.css";

function UserProfile() {
    const { userData } = useContext(userContext);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const { handleError } = useHandleError();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (userData && userData.user_id) {
                try {
                    let response = await fetchData(userData.type_name, "users", "user_id", userData.user_id, handleError);
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

    // פונקציה לעדכון הפרופיל - רק השדות הניתנים לעריכה
    const updateProfile = (updatedData) => {
        const allowedFields = ['name', 'email'];
        const filteredData = {};
        
        allowedFields.forEach(field => {
            if (updatedData[field] !== undefined) {
                filteredData[field] = updatedData[field];
            }
        });
        
        setUserDetails(prevDetails => ({
            ...prevDetails,
            ...filteredData
        }));
    };

    if (loading) {
        return <div className="loading">טוען...</div>;
    }

    if (!userDetails) {
        return <div className="error">לא ניתן לטעון את הפרופיל</div>;
    }

    // יצירת אובייקט עם השדות הניתנים לעריכה בלבד
    const editableUserData = {
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
                        item={editableUserData}
                        type="/users"
                        updateDisplay={updateProfile}
                        nameButton="עריכת פרופיל"
                        userType={userData?.type_name}
                    />
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
