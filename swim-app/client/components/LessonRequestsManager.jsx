import React, { useState, useEffect, useContext } from 'react';
import { userContext } from './App';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleError from '../hooks/useHandleError';
import useHandleDisplay from '../hooks/useHandleDisplay';
import AddItem from './AddItem';
import LessonRequest from './LessonRequest';
import {
    formatDate,
    formatTime,
    translateLessonType,
    translateLevel
} from '../structures/lessonStructures';
import {
    createLessonRequestKeys,
    createLessonRequestValidationRules
} from '../structures/lessonRequestStructures';
import '../styles/TeacherRequests.css';

export const LessonRequestsContext = React.createContext();

const getStatusText = (status) => {
    switch (status) {
        case 'pending': return 'ממתין לאישור';
        case 'approved': return 'אושר';
        case 'rejected': return 'נדחה';
        default: return status;
    }
};

function LessonRequestsManager() {
    const { userData } = useContext(userContext);
    const [requests, setRequests, updateRequests, deleteRequests] = useHandleDisplay([]);
    const [teachers, setTeachers] = useState([]);
    const [pools, setPools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [displayChanged, setDisplayChanged] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { handleError } = useHandleError();

    const isTeacher = userData?.type_name === 'teacher';
    const isStudent = userData?.type_name === 'student';

    useEffect(() => {
        if (!isStudent) return;
        
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
    }, [isStudent]);

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

    const getFilteredRequests = () => {
        let filteredByUser = requests;
        
        if (isTeacher) {
            filteredByUser = requests.filter(request => request.status === 'pending');
        }
        
        if (filter === 'all') return filteredByUser;
        return filteredByUser.filter(request => request.status === filter);
    };

    const filteredRequests = getFilteredRequests();
    const pendingCount = requests.filter(request => request.status === 'pending').length;

    const requestKeys = createLessonRequestKeys(teachers, pools);
    const requestValidationRules = createLessonRequestValidationRules();

    const handleAddRequest = (newRequest) => {
        console.log('New request added:', newRequest);
        
        setSuccessMessage('🎉 הבקשה נשלחה בהצלחה למורה!');
        setTimeout(() => {
            setSuccessMessage('');
        }, 4000);
        
        setDisplayChanged(prev => !prev);
    };

    if (!userData) {
        return <div className="loading">טוען נתוני משתמש...</div>;
    }

    if (!isTeacher && !isStudent) {
        return (
            <div className="teacher-requests-container">
                <div className="error">גישה מוגבלת למורים ותלמידים בלבד</div>
            </div>
        );
    }

    return (
        <LessonRequestsContext.Provider value={{
            updateRequests,
            deleteRequests,
            setDisplayChanged
        }}>
            <div className="teacher-requests-container">
                <div className="page-header">
                    <div className="page-header-content">
                        <div className="page-title-section">
                            <h1>
                                {isTeacher ? 'בקשות שיעורים' : 'בקשת שיעור פרטי'}
                            </h1>
                            <p>
                                {isTeacher 
                                    ? 'בקשות שיעורים שנשלחו אליך מתלמידים'
                                    : 'שלח בקשה למורה לשיעור פרטי בזמן שמתאים לך'
                                }
                            </p>
                            {isTeacher && pendingCount > 0 && (
                                <div className="pending-badge">
                                    {pendingCount} בקשות ממתינות
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                {isStudent && (
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
                )}

                <div className="filters-section">
                    <div className="filter-group">
                        <label>סינון לפי סטטוס:</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">
                                הכל ({isTeacher ? filteredRequests.length : requests.length})
                            </option>
                            {isStudent && (
                                <>
                                    <option value="pending">
                                        ממתינות ({requests.filter(r => r.status === 'pending').length})
                                    </option>
                                    <option value="approved">
                                        אושרו ({requests.filter(r => r.status === 'approved').length})
                                    </option>
                                    <option value="rejected">
                                        נדחו ({requests.filter(r => r.status === 'rejected').length})
                                    </option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">טוען בקשות...</div>
                ) : filteredRequests.length === 0 ? (
                    <div className="no-requests">
                        <h3>
                            {filter === 'all' 
                                ? (isTeacher ? 'אין בקשות ממתינות' : 'אין לך בקשות שיעור')
                                : `אין בקשות ${getStatusText(filter)}`
                            }
                        </h3>
                        <p>
                            {filter === 'all'
                                ? (isTeacher 
                                    ? 'כרגע אין לך בקשות שיעורים ממתינות'
                                    : 'לחץ על "שלח בקשה חדשה" כדי לשלוח בקשה למורה'
                                  )
                                : `כרגע אין לך בקשות ${getStatusText(filter)}`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="requests-container">
                        <div className="requests-grid">
                            {filteredRequests.map(request => (
                                <LessonRequest 
                                    key={request.request_id} 
                                    request={request} 
                                    mode={isTeacher ? 'teacher' : 'student'}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </LessonRequestsContext.Provider>
    );
}

export default LessonRequestsManager;
