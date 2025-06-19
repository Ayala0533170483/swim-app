import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaImage } from "react-icons/fa";
import "../styles/AddItem.css";
import "../styles/FileInput.css";
import useHandleError from "../hooks/useHandleError";
import refreshToken from "../js-files/RefreshToken";
import Cookies from 'js-cookie';

function AddItem({
    userType,
    keys,
    type,
    addDisplay,
    defaltValues = {},
    nameButton = "הוסף פריט",
    setDisplayChanged = () => { },
    validationRules = {},
    userId = null,
    useContactStyle = false
}) {
    const [showAddItem, setShowAddItem] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const { handleError } = useHandleError();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: defaltValues,
        mode: 'onChange'
    });
    const watchedValues = watch();

    // פונקציה לטיפול בבחירת תמונה
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
            
            // עדכון הטופס
            setValue('image', file);
        } else {
            setImagePreview(null);
            setSelectedFile(null);
            setValue('image', null);
        }
    };

    const sendAddRequest = async (token, data) => {
        const url = `http://localhost:3000/${type}`;
        const headers = {};

        console.log('🔍 Original data:', data);
        console.log('🔍 Selected file:', selectedFile);
        console.log('🔍 Keys:', keys);

        // בדיקה אם יש קבצים (תמונות)
        const hasFiles = selectedFile || (keys && keys.some(key => key.type === 'file'));
        
        let body;
        if (hasFiles && selectedFile) {
            // שליחה כ-FormData עבור קבצים
            const formData = new FormData();
            
            console.log('🔍 Creating FormData...');
            
            // הוספת כל השדות ל-FormData
            Object.keys(data).forEach(key => {
                if (key === 'image') {
                    // דלג על שדה image מהנתונים הרגילים
                    return;
                } else if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                    formData.append(key, data[key]);
                    console.log(`🔍 Added to FormData: ${key} = ${data[key]}`);
                }
            });
            
            // הוספת קובץ התמונה
            formData.append('image', selectedFile);
            console.log('🔍 Added image file to FormData:', selectedFile.name);
            
            body = formData;
            // לא מגדירים Content-Type - הדפדפן יגדיר אוטומטית עם boundary
        } else {
            // שליחה רגילה כ-JSON
            headers["Content-Type"] = "application/json";
            
            // הסר את שדה התמונה אם אין קובץ
            const { image, ...cleanData } = data;
            body = JSON.stringify(cleanData);
            console.log('🔍 Sending JSON:', cleanData);
        }

        headers.Authorization = `Bearer ${token}`;

        return await fetch(url, {
            method: "POST",
            headers,
            credentials: 'include',
            body,
        });
    };

    const onSubmit = async (data) => {
        if (isSubmitting) return;

        console.log('🔍 Form submitted with data:', data);
        console.log('🔍 Selected file state:', selectedFile);

        setIsSubmitting(true);
        let token = Cookies.get("accessToken");

        try {
            let response = await sendAddRequest(token, data);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendAddRequest(token, data);
            }

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Success response:', result);

                addDisplay(result.data || result);
                setDisplayChanged(true);
                reset(defaltValues);
                setShowAddItem(false);
                setImagePreview(null);
                setSelectedFile(null);

            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Error response:', errorData);

                if (useContactStyle) {
                    alert(errorData.message || 'שגיאה בשליחת ההודעה. אנא נסה שוב.');
                } else {
                    // הצגת הודעת שגיאה ספציפית לתמונות
                    if (errorData.message) {
                        alert(errorData.message);
                    } else {
                        handleError("addError", null, true);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Network error:', error);

            if (useContactStyle) {
                alert('שגיאת רשת. אנא בדוק את החיבור לאינטרנט ונסה שוב.');
            } else {
                handleError("addError", error, false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset(defaltValues);
        setShowAddItem(false);
        setImagePreview(null);
        setSelectedFile(null);
    };

    const handleFieldChange = (field, value) => {
        if (validationRules.onFieldChange) {
            const updates = validationRules.onFieldChange(field.key, value, watchedValues, setValue);
            if (updates) {
                Object.keys(updates).forEach(key => {
                    setValue(key, updates[key]);
                });
            }
        }
    };

    const clearImage = (fieldKey) => {
        setImagePreview(null);
        setSelectedFile(null);
        const fileInput = document.getElementById(`${fieldKey}-file`);
        if (fileInput) {
            fileInput.value = '';
        }
        setValue('image', null);
    };

    if (useContactStyle) {
        return (
            <div className="contact-submit-section">
                <button
                    type="button"
                    className={`contact-submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    onClick={() => {
                        const formData = new FormData(document.querySelector('.contact-form form') || document.createElement('form'));
                        const data = {};
                        for (let [key, value] of formData.entries()) {
                            data[key] = value;
                        }

                        const finalData = Object.keys(data).length > 0 ? data : watchedValues;

                        console.log('Contact form data:', finalData);
                        onSubmit(finalData);
                    }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'שולח...' : nameButton}
                </button>
            </div>
        );
    }

    return (
        <>
            <button className="edit-button" onClick={() => setShowAddItem(true)}>
                {nameButton}
            </button>

            {showAddItem && (
                <div className="overlay">
                    <div className="modal">
                        <h2 className="modal-title">{nameButton}</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
                            {keys && keys.map((field) => (
                                <div key={field.key} className="form-field">
                                    <label htmlFor={field.key} className="field-label">
                                        {field.label}:
                                        {field.required && <span className="required-star"> *</span>}
                                    </label>

                                    {field.type === 'select' ? (
                                        <>
                                            <select
                                                id={field.key}
                                                className="field-input"
                                                {...register(field.key, validationRules[field.key] || {})}
                                                onChange={(e) => handleFieldChange(field, e.target.value)}
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
                                                    {errors[field.key].message}
                                                </span>
                                            )}
                                        </>
                                    ) : field.type === 'textarea' ? (
                                        <>
                                            <textarea
                                                id={field.key}
                                                placeholder={field.placeholder || field.label}
                                                className="field-input"
                                                rows={field.rows || 3}
                                                {...register(field.key, validationRules[field.key] || {})}
                                                onChange={(e) => handleFieldChange(field, e.target.value)}
                                            />
                                            {errors[field.key] && (
                                                <span className="error-message">
                                                    {errors[field.key].message}
                                                </span>
                                            )}
                                        </>
                                    ) : field.type === 'file' ? (
                                        <>
                                            <div className="file-input-wrapper">
                                                <input
                                                    type="file"
                                                    id={`${field.key}-file`}
                                                    accept={field.accept || 'image/*'}
                                                    className="hidden-file-input"
                                                    onChange={handleImageChange}
                                                />
                                                <div 
                                                    className="fake-file-input"
                                                    onClick={() => document.getElementById(`${field.key}-file`).click()}
                                                >
                                                    <span className="file-input-text">
                                                        {selectedFile ? `נבחר: ${selectedFile.name}` : 'בחר תמונה...'}
                                                    </span>
                                                    <div className="file-input-icons">
                                                        {selectedFile && (
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
                                            
                                            {imagePreview && (
                                                <div className="mini-image-preview">
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="תצוגה מקדימה" 
                                                        className="mini-preview-image"
                                                    />
                                                </div>
                                            )}
                                            
                                            {errors[field.key] && (
                                                <span className="error-message">
                                                    {errors[field.key].message}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                id={field.key}
                                                type={field.inputType || 'text'}
                                                placeholder={field.placeholder || field.label}
                                                className="field-input"
                                                min={field.min}
                                                max={field.max}
                                                step={field.step}
                                                {...register(field.key, validationRules[field.key] || {})}
                                                onChange={(e) => handleFieldChange(field, e.target.value)}
                                            />
                                            {errors[field.key] && (
                                                <span className="error-message">
                                                    {errors[field.key].message}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}

                            <div className="button-container">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'מוסיף...' : 'הוספה'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="btn-primary"
                                    disabled={isSubmitting}
                                >
                                    ביטול
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddItem;
