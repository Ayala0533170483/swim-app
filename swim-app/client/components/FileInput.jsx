import React, { useState } from 'react';
import { FaUpload } from "react-icons/fa";
import '../styles/FileInput.css';

function FileInput({
    value = null,
    onChange,
    accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    disabled = false,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ],
    onError = null,
    placeholder = "בחר קובץ...",
    showPreview = true,
    currentImageUrl = null,
    fieldKey = "file"
}) {
    const [selectedFile, setSelectedFile] = useState(value);
    const [imagePreview, setImagePreview] = useState(null);

    const clearFileInput = () => {
        const fileInput = document.getElementById(`${fieldKey}-file`);
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleFileChange = (event) => {
        try {
            const file = event.target.files[0];

            if (file) {
                // בדיקת גודל
                if (file.size > maxSize) {
                    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
                    const error = new Error(`גודל הקובץ חייב להיות קטן מ-${maxSizeMB}MB`);
                    
                    // נקה את הקובץ מה-input
                    clearFileInput();
                    
                    if (onError) onError(error);
                    return;
                }

                // בדיקת סוג קובץ
                if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
                    const error = new Error('סוג קובץ לא נתמך. אנא בחר PDF, Word או תמונה');
                    
                    // נקה את הקובץ מה-input
                    clearFileInput();
                    
                    if (onError) onError(error);
                    return;
                }

                // אם הכל תקין - המשך
                setSelectedFile(file);

                // יצירת preview לתמונות
                if (showPreview && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setImagePreview(e.target.result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    setImagePreview(null);
                }

                // קריאה לפונקציה החיצונית
                if (onChange) {
                    onChange(file);
                }

            } else {
                clearFile();
            }
        } catch (error) {
            clearFileInput();
            if (onError) onError(error);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setImagePreview(null);
        clearFileInput();
        if (onChange) {
            onChange(null);
        }
    };

    const getDisplayText = () => {
        if (selectedFile) {
            return `נבחר: ${selectedFile.name}`;
        }
        if (imagePreview) {
            return 'תמונה חדשה נבחרה';
        }
        if (currentImageUrl) {
            return 'תמונה קיימת';
        }
        return placeholder;
    };

    const getPreviewImage = () => {
        if (imagePreview) return imagePreview;
        if (currentImageUrl) return currentImageUrl;
        return null;
    };

    return (
        <div className="file-input-wrapper">
            {/* Input נסתר */}
            <input
                type="file"
                id={`${fieldKey}-file`}
                accept={accept}
                className="hidden-file-input"
                onChange={handleFileChange}
                disabled={disabled}
            />
            
            {/* אזור מעוצב */}
            <div
                className="fake-file-input"
                onClick={() => !disabled && document.getElementById(`${fieldKey}-file`).click()}
            >
                <span className="file-input-text">
                    {getDisplayText()}
                </span>
                <div className="file-input-icons">
                    {(selectedFile || imagePreview) && (
                        <button
                            type="button"
                            className="clear-file-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearFile();
                            }}
                            disabled={disabled}
                        >
                            ×
                        </button>
                    )}
                    <FaUpload className="file-input-icon" />
                </div>
            </div>

            {/* תצוגה מקדימה */}
            {showPreview && getPreviewImage() && (
                <div className="mini-image-preview">
                    <img
                        src={getPreviewImage()}
                        alt={imagePreview ? "תמונה חדשה" : "תמונה נוכחית"}
                        className="mini-preview-image"
                    />
                    {imagePreview && <small className="preview-label">תמונה חדשה</small>}
                </div>
            )}
        </div>
    );
}

export default FileInput;
