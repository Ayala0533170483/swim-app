import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import "../styles/AddItem.css";
import useHandleError from "./useHandleError";
import refreshToken from "../js-files/refreshToken";
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
    userId = null
}) {
    const [showAddItem, setShowAddItem] = useState(false);
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
    
    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });
};

    const onSubmit = async (data) => {
        let token = Cookies.get("accessToken");

        try {
            let response = await sendAddRequest(token, data);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendAddRequest(token, data);
            }

            if (response.ok) {
                const newItem = await response.json();
                addDisplay(newItem);
                setDisplayChanged(true);
                reset(defaltValues);
                setShowAddItem(false);
            } else {
                try {
                    const error = await response.json();
                    alert(error.error || 'הוספה נכשלה');
                } catch {
                    alert('הוספה נכשלה');
                }
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert('שגיאה בהוספה');
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

    return (
        <>
            <button className="edit-button" onClick={() => setShowAddItem(true)}>
                <FaPlus className="edit-icon" />
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
                                <button type="submit" className="btn-primary">
                                    הוספה
                                </button>
                                <button type="button" onClick={handleCancel} className="btn-primary">
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
