import React, { useState } from 'react';
import Update from './Update';
import DeleteItem from './DeleteItem';
import '../styles/Message.css';

function Message({ message, onUpdate, onDelete }) {
    const [showFullMessage, setShowFullMessage] = useState(false);

    const subjectTranslations = {
        registration: 'הרשמה',
        schedule: 'לוחות זמנים',
        prices: 'מחירים',
        facilities: 'מתקנים',
        complaint: 'תלונה',
        other: 'אחר'
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL');
    };

    const getMessagePreview = (text, maxLength = 80) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const messageFields = [
        {
            key: 'is_handled',
            label: 'סטטוס',
            type: 'select',
            options: [
                { value: 0, label: 'לא מטופל' },
                { value: 1, label: 'מטופל' }
            ]
        }
    ];

    const validationRules = {
        is_handled: {
            required: { message: 'יש לבחור סטטוס' }
        }
    };

    return (
        <>
            <div className={`message-card ${message.is_handled ? 'handled' : 'pending'}`}>
                <div className="message-header">
                    <div className="message-info">
                        <h3 className="sender-name">{message.full_name}</h3>
                        <p className="sender-email">{message.email}</p>
                        {message.phone && <p className="sender-phone">{message.phone}</p>}
                    </div>
                    <div className="message-status">
                        <span className={`status-badge ${message.is_handled ? 'handled' : 'pending'}`}>
                            {message.is_handled ? 'מטופל' : 'חדש'}
                        </span>
                    </div>
                </div>

                <div className="message-content">
                    <div className="message-subject">
                        <strong>נושא: </strong>
                        {subjectTranslations[message.subject] || message.subject}
                    </div>

                    <div className="message-text">
                        <strong>הודעה: </strong>
                        {getMessagePreview(message.message)}
                    </div>

                    <div className="message-date">
                        <strong>תאריך: </strong>
                        {formatDate(message.created_at)}
                    </div>
                </div>

                <div className="message-actions">
                    <button
                        className="btn-show-full"
                        onClick={() => setShowFullMessage(true)}
                    >
                        הצג מלא
                    </button>
                    <Update
                        item={message}
                        type="messages"
                        updateDisplay={onUpdate}
                        directUpdateData={{ is_handled: message.is_handled ? 0 : 1 }}
                        renderAs={
                            <button
                                className='btn-show-full'
                                title={message.is_handled ? 'סמן כלא מטופל' : 'סמן כמטופל'}
                            >
                                {message.is_handled ? 'סמן כלא מטופל' : 'סמן כמטופל'}
                            </button>
                        }
                    />

                    <DeleteItem
                        id={message.id}
                        type="messages"
                        deleteDisplay={onDelete}
                        nameButton="מחק"
                    />
                </div>
            </div>

            {showFullMessage && (
                <div className="message-modal-overlay" onClick={() => setShowFullMessage(false)}>
                    <div className="message-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>הודעה מלאה</h2>
                            <button
                                className="close-button"
                                onClick={() => setShowFullMessage(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="modal-field">
                                <strong>שם: </strong>{message.full_name}
                            </div>
                            <div className="modal-field">
                                <strong>אימייל: </strong>{message.email}
                            </div>
                            {message.phone && (
                                <div className="modal-field">
                                    <strong>טלפון: </strong>{message.phone}
                                </div>
                            )}
                            <div className="modal-field">
                                <strong>נושא: </strong>{subjectTranslations[message.subject] || message.subject}
                            </div>
                            <div className="modal-field">
                                <strong>תאריך: </strong>{formatDate(message.created_at)}
                            </div>
                            <div className="modal-field message-full-text">
                                <strong>הודעה: </strong>
                                <p>{message.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Message;
