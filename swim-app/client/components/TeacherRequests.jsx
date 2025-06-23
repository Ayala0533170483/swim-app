import React, { useState, useEffect, useContext } from 'react';
import { userContext } from './App';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleError from '../hooks/useHandleError';
import useHandleDisplay from '../hooks/useHandleDisplay';
import Update from './Update';
import Delete from './DeleteItem';
import '../styles/TeacherRequests.css';

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

function TeacherRequests() {
    const { userData } = useContext(userContext);
    const [requests, setRequests, updateRequests, deleteRequests] = useHandleDisplay([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [displayChanged, setDisplayChanged] = useState(false);
    const { handleError } = useHandleError();

    useEffect(() => {
        let isMounted = true;
        const fetchRequests = async () => {
            if (!userData?.user_id) {
                if (isMounted) setLoading(false);
                return;
            }

            try {
                if (isMounted) setLoading(true);
                const response = await fetchData('lessonRequests', '', handleError);

                if (!isMounted) return;

                const requestsData = response?.data || response || [];
                setRequests(requestsData);
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching requests:', error);
                    setRequests([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchRequests();
        return () => {
            isMounted = false;
        };
    }, [userData?.user_id, displayChanged]);

    const filteredRequests = requests.filter(request => {
        if (filter === 'all') return true;
        return request.status === filter;
    });

    const pendingCount = requests.filter(req => req.status === 'pending').length;

    if (!userData) {
        return <div className="loading">טוען נתוני משתמש...</div>;
    }

    if (userData.type_name !== 'teacher') {
        return (
            <div className="teacher-requests-container">
                <div className="error">גישה מוגבלת למורים בלבד</div>
            </div>
        );
    }

    return (
        <div className="teacher-requests-container">
            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-title-section">
                        <h1>בקשות שיעורים</h1>
                        <p>בקשות שיעורים שנשלחו אליך מתלמידים</p>
                        {pendingCount > 0 && (
                            <div className="pending-badge">
                                {pendingCount} בקשות ממתינות
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="filters-section">
                <div className="filter-group">
                    <label>סינון לפי סטטוס:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">הכל ({requests.length})</option>
                        <option value="pending">
                            ממתינות ({requests.filter(r => r.status === 'pending').length})
                        </option>
                        <option value="approved">
                            מאושרות ({requests.filter(r => r.status === 'approved').length})
                        </option>
                        <option value="rejected">
                            נדחות ({requests.filter(r => r.status === 'rejected').length})
                        </option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading">טוען בקשות...</div>
            ) : filteredRequests.length === 0 ? (
                <div className="no-requests">
                    <h3>
                        {filter === 'all' ? 'אין בקשות' : `אין בקשות ${getStatusText(filter)}`}
                    </h3>
                    <p>
                        {filter === 'all'
                            ? 'כרגע אין לך בקשות שיעורים'
                            : `כרגע אין לך בקשות ${getStatusText(filter)}`
                        }
                    </p>
                </div>
            ) : (
                <div className="requests-container">
                    <div className="requests-grid">
                        {filteredRequests.map(request => (
                            <div key={request.request_id} className="request-card">
                                <div className="request-header">
                                    <div className="request-icon">
                                        {request.status === 'pending' ? '⏳' :
                                            request.status === 'approved' ? '✅' : '❌'}
                                    </div>
                                    <div className="request-info">
                                        <h3 className="request-title">
                                            בקשה מ: {request.student_name || 'לא זמין'}
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
                                        <div className="info-item">
                                            <span className="info-label">שם התלמיד:</span>
                                            <span className="info-value">{request.student_name || 'לא זמין'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">אימייל:</span>
                                            <span className="info-value">{request.student_email || 'לא זמין'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">בריכה:</span>
                                            <span className="info-value">{request.pool_name || 'לא זמין'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">רמה:</span>
                                            <span className="info-value">{request.level || 'לא זמין'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">נשלח בתאריך:</span>
                                            <span className="info-value">
                                                {formatDate(request.requested_date)}
                                            </span>
                                        </div>

                                        {request.note && (
                                            <div className="info-item note-item">
                                                <span className="info-label">הערות מהתלמיד:</span>
                                                <span className="info-value note-text">{request.note}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {request.status === 'pending' && (
                                    <div className="request-actions">
                                        <Update
                                            item={{
                                                id: request.request_id,
                                                request_id: request.request_id
                                            }}
                                            type="lessonRequests"
                                            updateDisplay={updateRequests}
                                            nameButton="✅ אשר בקשה"
                                            setDisplayChanged={setDisplayChanged}
                                            directUpdateData={{ status: 'approved' }}
                                        />
                                        <Delete
                                            id={request.request_id}
                                            type="lessonRequests"
                                            deleteDisplay={deleteRequests}
                                            setDisplayChanged={setDisplayChanged}
                                            nameButton="❌ דחה בקשה"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeacherRequests;