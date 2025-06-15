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
            // שגיאת שרת (4xx, 5xx)
            errorMessage = `שגיאת שרת ב${errorTypes[errorType]}, נסה שוב מאוחר יותר`;
        } else {
            // שגיאות אחרות (רשת, חיבור)
            errorMessage = `בעיית חיבור ב${errorTypes[errorType]}, בדוק את החיבור לאינטרנט`;
        }

        setError((prev) => [...prev, errorMessage]);
        alert(errorMessage);
    };

    const clearErrors = () => setError([]);
    const logErrors = () => {
        errors.forEach((error) => {
            console.error(error);
        });
    };

    return { handleError, clearErrors, logErrors };
}
