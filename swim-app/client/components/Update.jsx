import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import "../styles/Update.css";
import useHandleError from "./useHandleError";
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
    validationRules = {}
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
        return await fetch(`http://localhost:3000/${type}/${item.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({ ...item, ...updatedItem }),
        });
    };

    async function updateItem() {
        if (!validateForm()) {
            return;
        }

        let token = Cookies.get("accessToken");

        try {
            let response = await sendUpdateRequest(token);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendUpdateRequest(token);
            }

            if (response.ok) {
                const updatedData = { ...item, ...updatedItem };
                updateDisplay(updatedData);
                setShowUpdateDetails(false);
                setDisplayChanged(true);
                setErrors({});
            } else {
                handleError("updateError", null, true); 
            }

        } catch (ex) {
            handleError("updateError", ex, false);
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

    return (
        <>
            <button className="edit-button" onClick={() => setShowUpdateDetails(true)}>
                <FaPen className="edit-icon" />
                {nameButton}
            </button>

            {showUpdateDetails && (
                <div className="overlay">
                    <div className="modal">
                        <h2 className="modal-title">{nameButton}</h2>
                        <div className="form-container">
                            {fieldsToRender.map((field) => (
                                <div key={field.key} className="form-field">
                                    <label htmlFor={field.key} className="field-label">
                                        {field.label}:
                                    </label>

                                    {field.type === 'select' ? (
                                        <>
                                            <select
                                                id={field.key}
                                                value={updatedItem[field.key] || ''}
                                                className="field-input"
                                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                            >
                                                <option value="">{field.placeholder || `בחר ${field.label}`}</option>
                                                {field.options?.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[field.key] && (
                                                <span className="error-message">
                                                    {errors[field.key]}
                                                </span>
                                            )}
                                        </>
                                    ) : field.type === 'textarea' ? (
                                        <>
                                            <textarea
                                                id={field.key}
                                                value={updatedItem[field.key] || ''}
                                                placeholder={field.placeholder || field.label}
                                                className="field-input"
                                                rows={field.rows || 3}
                                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                            />
                                            {errors[field.key] && (
                                                <span className="error-message">
                                                    {errors[field.key]}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                id={field.key}
                                                type={field.inputType || 'text'}
                                                value={updatedItem[field.key] || ''}
                                                placeholder={field.placeholder || field.label}
                                                className="field-input"
                                                min={field.min}
                                                max={field.max}
                                                step={field.step}
                                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                            />
                                            {errors[field.key] && (
                                                <span className="error-message">
                                                    {errors[field.key]}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="button-container">
                            <button onClick={updateItem} className="btn-primary">
                                עריכה
                            </button>
                            <button onClick={handleCancel} className="btn-primary">
                                ביטול
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Update;
