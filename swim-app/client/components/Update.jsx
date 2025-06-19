import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import "../styles/Update.css";
import useHandleError from "../hooks/useHandleError";
import refreshToken from "../js-files/RefreshToken";
import Cookies from 'js-cookie';

function Update({
    userType,
    item,
    type,
    updateDisplay,
    nameButton,
    setDisplayChanged = () => { },
    keys = null,
    validationRules = {},
    // 🎯 2 אופציות חדשות כמו שעשית
    directUpdateData = null, // הנתונים לעדכון ישיר
    renderAs = null // מה לרנדר במקום עיפרון
}) {
    const [showUpdateDetails, setShowUpdateDetails] = useState(false);
    const [updatedItem, setUpdatedItem] = useState(item);
    const [errors, setErrors] = useState({});
    const { handleError } = useHandleError();

    const handleInputChange = (key, value) => {
        setUpdatedItem((prevItem) => ({
            ...prevItem,
            [key]: value,
        }));

        if (errors[key]) {
            setErrors(prev => ({
                ...prev,
                [key]: null
            }));
        }

        if (validationRules.onFieldChange) {
            const updates = validationRules.onFieldChange(key, value, updatedItem, (field, newValue) => {
                setUpdatedItem(prev => ({
                    ...prev,
                    [field]: newValue
                }));
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (keys) {
            keys.forEach(field => {
                const value = updatedItem[field.key];
                const rules = validationRules[field.key];

                if (rules) {
                    if (rules.required && (!value || value.toString().trim() === '')) {
                        newErrors[field.key] = rules.required.message || `${field.label} הוא שדה חובה`;
                        isValid = false;
                    }

                    if (value && rules.pattern && !rules.pattern.value.test(value)) {
                        newErrors[field.key] = rules.pattern.message || `${field.label} לא תקין`;
                        isValid = false;
                    }

                    if (value && rules.minLength && value.length < rules.minLength.value) {
                        newErrors[field.key] = rules.minLength.message || `${field.label} חייב להכיל לפחות ${rules.minLength.value} תווים`;
                        isValid = false;
                    }

                    if (value && rules.maxLength && value.length > rules.maxLength.value) {
                        newErrors[field.key] = rules.maxLength.message || `${field.label} לא יכול להכיל יותר מ-${rules.maxLength.value} תווים`;
                        isValid = false;
                    }
                    if (value && rules.validate) {
                        const validationResult = rules.validate(value, updatedItem);
                        if (validationResult !== true) {
                            newErrors[field.key] = validationResult;
                            isValid = false;
                        }
                    }
                }
            });
        }

        setErrors(newErrors);
        return isValid;
    };

    const sendUpdateRequest = async (token) => {
        // 🎯 אם יש directUpdateData - השתמש בו, אחרת updatedItem
        const dataToSend = directUpdateData ?
            { ...item, ...directUpdateData } :
            { ...item, ...updatedItem };

        return await fetch(`http://localhost:3000/${type}/${item.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: 'include',
            body: JSON.stringify(dataToSend),
        });
    };

    async function updateItem() {
        // 🎯 אם זה עדכון ישיר - דלג על ולידציה
        if (!directUpdateData && !validateForm()) {
            return;
        }

        let token = Cookies.get("accessToken");

        try {
            let response = await sendUpdateRequest(token);

            if (response.status === 401) {
                token = await refreshToken();
                response = await sendUpdateRequest(token);
            }

            if (response.ok) {
                const updatedData = directUpdateData ?
                    { ...item, ...directUpdateData } :
                    { ...item, ...updatedItem };

                updateDisplay(updatedData);
                setShowUpdateDetails(false);
                setDisplayChanged(true);
                setErrors({});
            } else {
                throw new Error("Failed to update item.");
            }

        } catch (ex) {
            handleError("updateError", ex);
        }
    }

    const handleCancel = () => {
        setUpdatedItem(item);
        setShowUpdateDetails(false);
        setErrors({});
    };

    const fieldsToRender = keys || Object.keys(updatedItem).filter(key => key !== "id").map(key => ({
        key,
        label: key,
        type: 'input'
    }));

    if (directUpdateData) {
        return (
            <div onClick={updateItem} style={{ cursor: 'pointer', display: 'inline-block' }}>
                {renderAs || <span>עדכן</span>}
            </div>
        );
    }

    return (
        <>
            <FaPen className="edit-icon" onClick={() => setShowUpdateDetails(true)} />

            {showUpdateDetails && (
                <div className="overlay">
                    <div className="modal">
                        <h2>Edit {type}</h2>
                        {fieldsToRender.map((field) => (
                            <div key={field.key} style={{ marginBottom: "10px" }}>
                                <label htmlFor={field.key} style={{ display: "block", fontWeight: "bold" }}>
                                    {field.label || field.key}:
                                </label>
                                <input
                                    id={field.key}
                                    value={updatedItem[field.key] || ''}
                                    placeholder={field.key}
                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                />
                                {errors[field.key] && (
                                    <span className="error-message">
                                        {errors[field.key]}
                                    </span>
                                )}
                            </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                            <button onClick={updateItem} className="btn-primary">Update</button>
                            <button onClick={handleCancel} className="btn-primary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Update;
