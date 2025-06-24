import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import "../styles/AddItem.css";
import FileInput from './FileInput';
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
    useContactStyle = false,
    onError = null,
    onWarnings = null
}) {
    const [showAddItem, setShowAddItem] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleFileChange = (file) => {
        setSelectedFile(file);
        setValue('image', file);
    };

    const handleFileError = (error) => {
        handleError('addError', error);
    };

    const sendAddRequest = async (token, data) => {
        const url = `http://localhost:3000/${type}`;
        const headers = {};

        const hasFiles = selectedFile || (keys && keys.some(key => key.type === 'file'));
        let body;
        if (hasFiles && selectedFile) {
            const formData = new FormData();

            Object.keys(data).forEach(key => {
                if (key === 'image') {
                    return;
                } else if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                    formData.append(key, data[key]);
                }
            });
            formData.append('image', selectedFile);
            console.log('🔍 Added image file to FormData:', selectedFile.name);
            body = formData;
        } else {
            headers["Content-Type"] = "application/json";
            const { image, ...cleanData } = data;
            body = JSON.stringify(cleanData);
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

                if (result.warnings && result.warnings.length > 0 && onWarnings) {
                    onWarnings(result.warnings, result.data || result);
                }

                addDisplay(result.data || result);
                setDisplayChanged(true);
                reset(defaltValues);
                setShowAddItem(false);
                setSelectedFile(null);

            } else {
                const errorData = await response.json().catch(() => ({}));

                if (onError && typeof onError === 'function') {
                    const handled = onError({ response: { data: errorData, status: response.status } });
                    if (handled) {
                        setIsSubmitting(false);
                        return;
                    }
                }

                if (useContactStyle) {
                    alert(errorData.message || 'שגיאה בשליחת ההודעה. אנא נסה שוב.');
                } else {
                    if (errorData.message) {
                        alert(errorData.message);
                    } else {
                        handleError("addError", null, true);
                    }
                }
            }
        } catch (error) {
            if (onError && typeof onError === 'function') {
                const handled = onError(error);
                if (handled) {
                    setIsSubmitting(false);
                    return;
                }
            }

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
                                            <FileInput
                                                value={selectedFile}
                                                onChange={handleFileChange}
                                                onError={handleFileError}
                                                disabled={isSubmitting}
                                                accept={field.accept || 'image/*'}
                                                placeholder="בחר תמונה..."
                                                fieldKey={field.key}
                                                showPreview={true}
                                            />

                                            {field.note && (
                                                <small className="field-note">{field.note}</small>
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
