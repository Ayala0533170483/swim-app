import React, { useState } from "react";

export default function useHandleError() {
    const [errors, setError] = useState([]);
    const errorTypes = {
        getError: " fetching data",
        addError: " adding data to the database",
        deleteError: "deleteing data ",
        updateError: "updating data"
    }
    const handleError = (errorType, errorMessage) => {
        setError((prev) => [...prev, "an error occerred while " + errorTypes[errorType] + " :" + errorMessage]);
        alert("an error occerred while " + errorTypes[errorType] + ":" + errorMessage.message);
    };
    const clearErrors = () => setError(null);
    const logErrors = () => {
        errors.map((error) => {
            console.error(error);
        })
    }

    return { handleError, clearErrors, logErrors };
}