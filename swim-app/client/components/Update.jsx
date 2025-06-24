import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import "../styles/Update.css";
import FileInput from './FileInput';
import useHandleError from "../hooks/useHandleError";
import refreshToken from "../js-files/RefreshToken";
import Cookies from 'js-cookie';
import { getImageUrl } from "../structures/PoolCardStructure";

function Update({
    userType,
    item,
    type,
    updateDisplay,
    nameButton,
    setDisplayChanged = () => { },
    keys = null,
    validationRules = {},
    directUpdateData = null,
    renderAs = null
}) {
    const [showUpdateDetails, setShowUpdateDetails] = useState(false);
    const [updatedItem, setUpdatedItem] = useState(item);
    const [errors, setErrors] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
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

    const handleFileChange = (file) => {
        setSelectedFile(file);
    };

    const handleFileError = (error) => {
        setErrors(prev => ({
            ...prev,
            image: error.message
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (keys) {
            keys.forEach(field => {
                const value = updatedItem[field.key];
                const rules = validationRules[field.key];

                              if (field.type === 'file' && field.key === 'image') {
                    if (selectedFile) {
                        const maxSize = 5 * 1024 * 1024; 
                        if (selectedFile.size > maxSize) {
                            newErrors[field.key] = 'גודל התמונה חייב להיות עד 5MB';
                            isValid = false;
                        }

                        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                        if (!allowedTypes.includes(selectedFile.type)) {
                            newErrors[field.key] = 'רק קבצי JPG, JPEG, PNG מותרים';
                            isValid = false;
                        }
                    }
                    return; 
                }

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

    const sendUpdateRequest = async (token, dataToSend = null) => {
        const url = `http://localhost:3000/${type}/${item.pool_id || item.id}`;
        const headers = {};

        let body;
        if (selectedFile) {
            const formData = new FormData();

            Object.keys(updatedItem).forEach(key => {
                if (key === 'image') {
                    return;
                } else if (updatedItem[key] !== undefined && updatedItem[key] !== null && updatedItem[key] !== '') {
                    formData.append(key, updatedItem[key]);
                }
            });

            formData.append('image', selectedFile);
            console.log('🔍 Added image file to FormData:', selectedFile.name);
            body = formData;
        } else {
            headers["Content-Type"] = "application/json";
            const { image, ...cleanData } = dataToSend || { ...item, ...updatedItem };
            body = JSON.stringify(cleanData);
        }

        headers.Authorization = `Bearer ${token}`;

        return await fetch(url, {
            method: "PUT",
            headers,
            credentials: 'include',
            body,
        });
    };

    async function updateItem() {
        if (!validateForm()) {
            return;
        }

        let token = Cookies.get("accessToken");

        try {
            const dataToSend = { ...item, ...updatedItem };
            let response = await sendUpdateRequest(token, dataToSend);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendUpdateRequest(token, dataToSend);
            }

            if (response.ok) {
                const result = await response.json();
                const updatedData = result.data || dataToSend;

                updateDisplay(updatedData);
                setShowUpdateDetails(false);
                setDisplayChanged(true);
                setErrors({});
                setSelectedFile(null);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error response:', errorData);

                if (errorData.message && (errorData.message.includes('תמונה') || errorData.message.includes('גודל'))) {
                    alert(errorData.message);
                } else {
                    handleError("updateError", null, true);
                }
            }

        } catch (ex) {
            handleError("updateError", ex, false);
        }
    }

    async function quickUpdate() {
        let token = Cookies.get("accessToken");

        try {
            const dataToUpdate = { ...item, ...directUpdateData };
            let response = await sendUpdateRequest(token, dataToUpdate);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendUpdateRequest(token, dataToUpdate);
            }

            if (response.ok) {
                const result = await response.json();
                const updatedData = result.data || dataToUpdate;
                updateDisplay(updatedData);
                setDisplayChanged(true);
            } else {
                const errorData = await response.json().catch(() => ({}));
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
        setSelectedFile(null);
    };

    const fieldsToRender = keys || Object.keys(updatedItem).filter(key => key !== "id").map(key => ({
        key,
        label: key,
        type: 'input'
    }));

    const currentImageUrl = item.image_path ? getImageUrl(item.image_path) : null;

    return (
        <>
            {directUpdateData ? (
                renderAs ? (
                    React.cloneElement(renderAs, { onClick: quickUpdate })
                ) : (
                    <button className="edit-button" onClick={quickUpdate}>
                        <FaPen className="edit-icon" />
                        {nameButton}
                    </button>
                )
            ) : (
                <button className="edit-button" onClick={() => setShowUpdateDetails(true)}>
                    <FaPen className="edit-icon" />
                    {nameButton}
                </button>
            )}

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
                                    ) : field.type === 'file' ? (
                                        <>
                                            <FileInput
                                                value={selectedFile}
                                                onChange={handleFileChange}
                                                onError={handleFileError}
                                                disabled={false}
                                                accept={field.accept || 'image/*'}
                                                placeholder="בחר תמונה חדשה..."
                                                fieldKey={field.key}
                                                showPreview={true}
                                                currentImageUrl={currentImageUrl}
                                            />

                                            {field.note && (
                                                <small className="field-note">{field.note}</small>
                                            )}

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
