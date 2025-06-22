import React, { useState } from "react";

export default function useHandleError() {
    const [errors, setError] = useState([]);

    const errorTypes = {
        getError: "קריאת נתונים",
        addError: "הוספת נתונים",
        deleteError: "מחיקת נתונים",
        updateError: "עדכון נתונים"
    }

    const handleError = (errorType, error, isServerError = false) => {
        let errorMessage = "";

        if (isServerError) {
            errorMessage = `שגיאת שרת ב${errorTypes[errorType]}, נסה שוב מאוחר יותר`;
        } else {
            errorMessage = `בעיית חיבור ב${errorTypes[errorType]}, בדוק את החיבור לאינטרנט`;
        }

        setError((prev) => [...prev, errorMessage]);
        alert(errorMessage);
    };

    // פונקציה פשוטה שרק מזהה קונפליקטים - המודל יטפל בהצגה
    const handleLessonConflictError = (error) => {
        if (error.response?.data?.type === 'SCHEDULE_CONFLICT') {
            return true; // מסמן שזה קונפליקט שיעורים
        }
        return false;
    };

    const clearErrors = () => setError([]);
    const logErrors = () => {
        errors.forEach((error) => {
            console.error(error);
        });
    };

    return { handleError, handleLessonConflictError, clearErrors, logErrors };
}
