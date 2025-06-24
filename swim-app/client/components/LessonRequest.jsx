import React, { useContext } from 'react';
import { userContext } from './App';
import { LessonRequestsContext } from './LessonRequestsManager';
import Update from './Update';
import Delete from './DeleteItem';
import { translateLevel } from '../structures/lessonStructures'; // ← הוסף את זה

const getStatusText = (status) => {
    switch (status) {
        case 'pending': return 'ממתין לאישור';
        case 'approved': return 'אושר';
        case 'rejected': return 'נדחה';
        default: return status;
    }
};

const getStatusClass = (status) => {
    switch (status) {
        case 'pending': return 'status-pending';
        case 'approved': return 'status-approved';
        case 'rejected': return 'status-rejected';
        default: return '';
    }
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('he-IL');
};

const formatTime = (timeString) => {
    return timeString.substring(0, 5);
};

function LessonRequest({ request, mode = 'teacher' }) {
    const { userData } = useContext(userContext);
    const { updateRequests, deleteRequests, setDisplayChanged } = useContext(LessonRequestsContext);

    const isTeacherMode = mode === 'teacher';
    const isStudentMode = mode === 'student';

    const handleApproveRequest = (requestId) => {
        updateRequests({
            request_id: requestId,
            status: 'approved'
        });
    };

    const handleRejectRequest = (requestId) => {
        deleteRequests(requestId);
    };
    
    return (
        <div key={request.request_id} className="request-card" data-status={request.status}>
            <div className="request-header">
                <div className="request-icon">
                    {isStudentMode ? '📝' :
                        request.status === 'pending' ? '⏳' :
                            request.status === 'approved' ? '✅' : '❌'}
                </div>
                <div className="request-info">
                    <h3 className="request-title">
                        {isTeacherMode 
                            ? `בקשה מ: ${request.student_name || request.student_first_name || 'לא זמין'}`
                            : `בקשה למורה: ${request.teacher_name || request.teacher_first_name || 'לא זמין'}`
                        }
                    </h3>
                    <div className="request-meta">
                        <span className="request-date">
                            📅 {formatDate(request.request_date)}
                        </span>
                        <span className="request-time">
                            🕐 {formatTime(request.start_time)} - {formatTime(request.end_time)}
                        </span>
                        <span className={`request-status ${getStatusClass(request.status)}`}>
                            {getStatusText(request.status)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="request-details">
                <div className="request-info-grid">
                    {isTeacherMode ? (
                        <>
                            <div className="info-item">
                                <span className="info-label">שם התלמיד:</span>
                                <span className="info-value">
                                    {request.student_name || request.student_first_name || 'לא זמין'}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">אימייל:</span>
                                <span className="info-value">
                                    {request.student_email || request.email || 'לא זמין'}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="info-item">
                            <span className="info-label">מורה:</span>
                            <span className="info-value">
                                {request.teacher_name || request.teacher_first_name || 'לא זמין'}
                            </span>
                        </div>
                    )}
                    
                    <div className="info-item">
                        <span className="info-label">בריכה:</span>
                        <span className="info-value">{request.pool_name || 'לא זמין'}</span>
                    </div>
                    
                    {request.level && (
                        <div className="info-item">
                            <span className="info-label">רמה:</span>
                            <span className="info-value">{translateLevel(request.level)}</span> {/* ← תיקון כאן */}
                        </div>
                    )}
                    
                    <div className="info-item">
                        <span className="info-label">נשלח בתאריך:</span>
                        <span className="info-value">
                            {formatDate(request.requested_date)}
                        </span>
                    </div>

                    {request.note && (
                        <div className="info-item note-item">
                            <span className="info-label">
                                {isTeacherMode ? 'הערות מהתלמיד:' : 'הערות:'}
                            </span>
                            <span className="info-value note-text">{request.note}</span>
                        </div>
                    )}
                </div>
            </div>

            {isTeacherMode && request.status === 'pending' && (
                <div className="request-actions">
                    <Update
                        item={{
                            id: request.request_id,
                            request_id: request.request_id
                        }}
                        type="lessonRequests"
                        updateDisplay={(updatedData) => {
                            updateRequests(updatedData);
                            handleApproveRequest(request.request_id);
                        }}
                        nameButton="✅ אשר בקשה"
                        setDisplayChanged={setDisplayChanged}
                        directUpdateData={{ status: 'approved' }}
                    />
                    <Delete
                        id={request.request_id}
                        type="lessonRequests"
                        deleteDisplay={(deletedId) => {
                            deleteRequests(deletedId);
                            handleRejectRequest(deletedId);
                        }}
                        setDisplayChanged={setDisplayChanged}
                        nameButton="❌ דחה בקשה"
                    />
                </div>
            )}
        </div>
    );
}

export default LessonRequest;
