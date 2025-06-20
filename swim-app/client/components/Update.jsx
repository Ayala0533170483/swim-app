import React, { useState } from "react";
import { FaPen, FaImage } from "react-icons/fa";
import "../styles/Update.css";
import "../styles/FileInput.css";
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
    const [imagePreview, setImagePreview] = useState(null);
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

    // פונקציה לטיפול בבחירת תמונה חדשה
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {
            // יצירת preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (keys) {
            keys.forEach(field => {
                const value = updatedItem[field.key];
                const rules = validationRules[field.key];

                // עבור שדה תמונה בעדכון - לא חובה (שונה מהוספה)
                if (field.type === 'file' && field.key === 'image') {
                    if (selectedFile) {
                        // אם נבחר קובץ חדש, בדוק אותו
                        const maxSize = 5 * 1024 * 1024; // 5MB
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
                    return; // דלג על בדיקות נוספות לשדה תמונה
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
                if (key !== 'image' && updatedItem[key] !== undefined && updatedItem[key] !== null) {
                    formData.append(key, updatedItem[key]);
                }
            });

            formData.append('image', selectedFile);

            body = formData;
        } else {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(dataToSend || { ...item, ...updatedItem });
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
            let response = await sendUpdateRequest(token);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendUpdateRequest(token);
            }

            if (response.ok) {
                const result = await response.json();
                const updatedData = result.data || { ...item, ...updatedItem };

                updateDisplay(updatedData);
                setShowUpdateDetails(false);
                setDisplayChanged(true);
                setErrors({});
                setImagePreview(null);
                setSelectedFile(null);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error response:', errorData);

                // הצגת הודעת שגיאה ספציפית
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
        setImagePreview(null);
        setSelectedFile(null);
    };

    const clearImage = (fieldKey) => {
        setImagePreview(null);
        setSelectedFile(null);
        const fileInput = document.getElementById(`${fieldKey}-file`);
        if (fileInput) {
            fileInput.value = '';
        }
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
                                            <div className="file-input-wrapper">
                                                <input
                                                    type="file"
                                                    id={`${field.key}-file`}
                                                    accept={field.accept}
                                                    className="hidden-file-input"
                                                    onChange={handleImageChange}
                                                />
                                                <div
                                                    className="fake-file-input"
                                                    onClick={() => document.getElementById(`${field.key}-file`).click()}
                                                >
                                                    <span className="file-input-text">
                                                        {imagePreview ? 'תמונה חדשה נבחרה' :
                                                            currentImageUrl ? 'תמונה קיימת' : 'בחר תמונה...'}
                                                    </span>
                                                    <div className="file-input-icons">
                                                        {(imagePreview || selectedFile) && (
                                                            <button
                                                                type="button"
                                                                className="clear-file-btn"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    clearImage(field.key);
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                        <FaImage className="file-input-icon" />
                                                    </div>
                                                </div>
                                            </div>

                                            {field.note && (
                                                <small className="field-note">{field.note}</small>
                                            )}

                                            {/* תמונה קטנה - נוכחית או חדשה */}
                                            {(imagePreview || currentImageUrl) && (
                                                <div className="mini-image-preview">
                                                    <img
                                                        src={imagePreview || currentImageUrl}
                                                        alt={imagePreview ? "תמונה חדשה" : "תמונה נוכחית"}
                                                        className="mini-preview-image"
                                                    />
                                                    {imagePreview && <small className="preview-label">תמונה חדשה</small>}
                                                </div>
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
