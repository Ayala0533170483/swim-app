import React, { useState, useEffect, useContext } from 'react';
import { userContext } from './App';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleError from '../hooks/useHandleError';
import AddItem from './AddItem';
import {
    createLessonKeys,
    createLessonValidationRules,
    formatDate,
    formatTime,
    translateLessonType,
    translateLevel
} from '../structures/lessonStructures';

function RequestLesson() {
    const { userData } = useContext(userContext);
    const [teachers, setTeachers] = useState([]);
    const [pools, setPools] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const { handleError } = useHandleError();

    useEffect(() => {
        let isMounted = true;
        const fetchTeachers = async () => {
            try {
                const response = await fetchData('users?type=teachers', '', handleError);
                
                if (!isMounted) return;
                
                if (response && response.success && response.data) {
                    setTeachers(response.data);
                } else if (response && Array.isArray(response)) {
                    setTeachers(response);
                } else {
                    setTeachers([]);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching teachers:', error);
                    setTeachers([]);
                }
            }
        };

        fetchTeachers();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchPools = async () => {
            try {
                const response = await fetchData('branches', '', handleError);
                
                if (!isMounted) return;
                
                if (response && response.success && response.data) {
                    setPools(response.data);
                } else if (response && Array.isArray(response)) {
                    setPools(response);
                } else {
                    setPools([]);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching pools:', error);
                    setPools([]);
                }
            }
        };

        fetchPools();
        return () => {
            isMounted = false;
        };
    }, []);

    // טעינת הבקשות של התלמיד
    useEffect(() => {
        let isMounted = true;
        const fetchMyRequests = async () => {
            if (!userData?.user_id) {
                if (isMounted) setLoading(false);
                return;
            }
            
            try {
                if (isMounted) setLoading(true);
                const response = await fetchData(`lessonRequests`, '', handleError);
                
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

        fetchMyRequests();
        return () => {
            isMounted = false;
        };
    }, [userData?.user_id]);

    const handleAddRequest = (newRequest) => {
        console.log('New request added:', newRequest);
        setRequests(prev => [newRequest, ...prev]);
        
        setSuccessMessage('🎉 הבקשה נשלחה בהצלחה למורה!');
        setTimeout(() => {
            setSuccessMessage('');
        }, 4000);
    };

    // יצירת מפתחות לבקשת שיעור - רק השדות הרלוונטיים
    const requestKeys = [
        {
            key: 'teacher_id',
            label: 'בחר מורה',
            type: 'select',
            placeholder: 'בחר מורה',
            options: teachers.map(teacher => ({
                value: teacher.user_id,
                label: teacher.name
            }))
        },
        {
            key: 'pool_id',
            label: 'בחר בריכה',
            type: 'select',
            placeholder: 'בחר בריכה',
            options: pools.map(pool => ({
                value: pool.pool_id,
                label: `${pool.name} - ${pool.city}`
            }))
        },
        ...createLessonKeys(pools).filter(key => 
            ['lesson_date', 'start_time', 'end_time', 'lesson_type', 'level', 'max_participants', 'min_age', 'max_age'].includes(key.key)
        ).map(key => {
            if (key.key === 'lesson_date') {
                return { ...key, key: 'request_date', label: 'תאריך השיעור המבוקש' };
            }
            return key;
        }),
        {
            key: 'note',
            label: 'הערות למורה',
            type: 'textarea',
            placeholder: 'הערות נוספות למורה (אופציונלי)',
            required: false,
            rows: 3
        }
    ];

    // שימוש בכללי הוולידציה מ-lessonStructures עם התאמות לבקשה
    const requestValidationRules = {
        teacher_id: { 
            required: 'יש לבחור מורה' 
        },
        pool_id: { 
            required: 'יש לבחור בריכה' 
        },
        ...createLessonValidationRules(),
        request_date: createLessonValidationRules().lesson_date
    };

    if (!userData) {
        return <div className="loading">טוען נתוני משתמש...</div>;
    }

    if (userData.type_name !== 'student') {
        return (
            <div className="request-lesson-container">
                <div className="error">גישה מוגבלת לתלמידים בלבד</div>
            </div>
        );
    }

    return (
        <div className="request-lesson-container">
            <div className="page-header">
                <h1>בקשת שיעור פרטי</h1>
                <p>שלח בקשה למורה לשיעור פרטי בזמן שמתאים לך</p>
            </div>

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            <div className="request-actions">
                <AddItem
                    type="lessonRequests"
                    addDisplay={handleAddRequest}
                    defaltValues={{
                        student_id: userData.user_id
                    }}
                    nameButton="שלח בקשה חדשה"
                    keys={requestKeys}
                    validationRules={requestValidationRules}
                />
            </div>

            <div className="my-requests-section">
                <h2>הבקשות שלי</h2>
                
                {loading ? (
                    <div className="loading">טוען בקשות...</div>
                ) : requests.length === 0 ? (
                    <div className="no-requests">
                        <h3>אין לך בקשות שיעור</h3>
                        <p>לחץ על "שלח בקשה חדשה" כדי לשלוח בקשה למורה</p>
                    </div>
                ) : (
                    <div className="requests-grid">
                        {requests.map(request => (
                            <div key={request.request_id} className="request-card">
                                <div className="request-header">
                                    <div className="request-icon">
                                        📝
                                    </div>
                                    <div className="request-info">
                                        <h3 className="request-title">
                                            בקשה למורה: {request.teacher_name}
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
                                            <span className="info-label">בריכה:</span>
                                            <span className="info-value">{request.pool_name}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">נשלח בתאריך:</span>
                                            <span className="info-value">
                                                {formatDate(request.requested_date)}
                                            </span>
                                        </div>
                                        
                                        {request.note && (
                                            <div className="info-item note-item">
                                                <span className="info-label">הערות:</span>
                                                <span className="info-value">{request.note}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    function getStatusText(status) {
        switch (status) {
            case 'pending': return 'ממתין לאישור';
            case 'approved': return 'אושר';
            case 'rejected': return 'נדחה';
            default: return status;
        }
    }

    function getStatusClass(status) {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'approved': return 'status-approved';
            case 'rejected': return 'status-rejected';
            default: return '';
        }
    }
}

export default RequestLesson;
