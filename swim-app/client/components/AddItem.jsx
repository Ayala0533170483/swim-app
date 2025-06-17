import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import "../styles/AddItem.css";
import useHandleError from "./useHandleError";
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

    const sendAddRequest = async (token, data) => {
        const url = `http://localhost:3000/${type}`;

        const headers = {
            "Content-Type": "application/json"
        };


        headers.Authorization = `Bearer ${token}`;


        return await fetch(url, {
            method: "POST",
            headers,
            credentials: 'include',
            body: JSON.stringify(data),
        });
    };

    const onSubmit = async (data) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        let token = Cookies.get("accessToken");

        try {
            console.log('Submitting data:', data);
            let response = await sendAddRequest(token, data);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendAddRequest(token, data);
            }

            if (response.ok) {
                const result = await response.json();
                console.log('Success response:', result);

                addDisplay(result.data || result);
                setDisplayChanged(true);
                reset(defaltValues);
                setShowAddItem(false);

            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error response:', errorData);

                if (useContactStyle) {
                    alert(errorData.message || 'שגיאה בשליחת ההודעה. אנא נסה שוב.');
                } else {
                    handleError("addError", null, true);
                }
            }
        } catch (error) {
            console.error('Network error:', error);

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
