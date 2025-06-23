// import React, { useState, useEffect, useContext } from 'react';
// import { userContext } from './App';
// import { fetchData } from '../js-files/GeneralRequests';
// import useHandleError from '../hooks/useHandleError';
// import refreshToken from '../js-files/RefreshToken';
// import Cookies from 'js-cookie';
// import '../styles/TeacherRequests.css';

// function TeacherRequests() {
//     const { userData } = useContext(userContext);
//     const [requests, setRequests] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
//     const { handleError } = useHandleError();

//     useEffect(() => {
//         let isMounted = true;
//         const fetchRequests = async () => {
//             if (!userData?.user_id) {
//                 if (isMounted) setLoading(false);
//                 return;
//             }

//             try {
//                 if (isMounted) setLoading(true);
//                 const response = await fetchData(`lessonRequests/teacher/${userData.user_id}`, '', handleError);

//                 if (!isMounted) return;

//                 const requestsData = response?.data || response || [];
//                 setRequests(requestsData);
//             } catch (error) {
//                 if (isMounted) {
//                     console.error('Error fetching requests:', error);
//                     setRequests([]);
//                 }
//             } finally {
//                 if (isMounted) {
//                     setLoading(false);
//                 }
//             }
//         };

//         fetchRequests();
//         return () => {
//             isMounted = false;
//         };
//     }, [userData?.user_id]);

//     const handleStatusUpdate = async (requestId, status) => {
//         try {
//             let token = Cookies.get("accessToken");

//             const sendRequest = async (token) => {
//                 return await fetch(`http://localhost:3000/lessonRequests/${requestId}/status`, {
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     },
//                     credentials: 'include',
//                     body: JSON.stringify({
//                         status,
//                         teacher_id: userData.user_id
//                     })
//                 });
//             };

//             let response = await sendRequest(token);

//             if (response.status === 401 || response.status === 403) {
//                 token = await refreshToken();
//                 response = await sendRequest(token);
//             }

//             if (response.ok) {
//                 const result = await response.json();

//                 // עדכון הרשימה
//                 setRequests(prev => 
//                     prev.map(req => 
//                         req.request_id === requestId 
//                             ? { ...req, status } 
//                             : req
//                     )
//                 );

//                 // הודעת הצלחה
//                 const message = status === 'approved' ? 'הבקשה אושרה בהצלחה!' : 'הבקשה נדחתה';
//                 alert(message);
//             } else {
//                 const errorData = await response.json();
//                 alert(errorData.message || 'שגיאה בעדכון הבקשה');
//             }
//         } catch (error) {
//             console.error('Error updating request:', error);
//             alert('שגיאה בעדכון הבקשה');
//         }
//     };

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('he-IL');
//     };

//     const formatTime = (timeString) => {
//         return timeString.substring(0, 5);
//     };

//     const getStatusText = (status) => {
//         switch (status) {
//             case 'pending': return 'ממתין לאישור';
//             case 'approved': return 'אושר';
//             case 'rejected': return 'נדחה';
//             default: return status;
//         }
//     };

//     const getStatusClass = (status) => {
//         switch (status) {
//             case 'pending': return 'status-pending';
//             case 'approved': return 'status-approved';
//             case 'rejected': return 'status-rejected';
//             default: return '';
//         }
//     };

//     const filteredRequests = requests.filter(request => {
//         if (filter === 'all') return true;
//         return request.status === filter;
//     });

//     const pendingCount = requests.filter(req => req.status === 'pending').length;

//     if (!userData) {
//         return <div className="loading">טוען נתוני משתמש...</div>;
//     }

//     if (userData.type_name !== 'teacher') {
//         return (
//             <div className="teacher-requests-container">
//                 <div className="error">גישה מוגבלת למורים בלבד</div>
//             </div>
//         );
//     }

//     return (
//         <div className="teacher-requests-container">
//             <div className="page-header">
//                 <div className="page-header-content">
//                     <div className="page-title-section">
//                         <h1>בקשות שיעורים</h1>
//                         <p>בקשות שיעורים שנשלחו אליך מתלמידים</p>
//                         {pendingCount > 0 && (
//                             <div className="pending-badge">
//                                 {pendingCount} בקשות ממתינות
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <div className="filters-section">
//                 <div className="filter-group">
//                     <label>סינון לפי סטטוס:</label>
//                     <select
//                         value={filter}
//                         onChange={(e) => setFilter(e.target.value)}
//                     >
//                         <option value="all">הכל ({requests.length})</option>
//                         <option value="pending">
//                             ממתינות ({requests.filter(r => r.status === 'pending').length})
//                         </option>
//                         <option value="approved">
//                             מאושרות ({requests.filter(r => r.status === 'approved').length})
//                         </option>
//                         <option value="rejected">
//                             נדחות ({requests.filter(r => r.status === 'rejected').length})
//                         </option>
//                     </select>
//                 </div>
//             </div>

//             {loading ? (
//                 <div className="loading">טוען בקשות...</div>
//             ) : filteredRequests.length === 0 ? (
//                 <div className="no-requests">
//                     <h3>
//                         {filter === 'all' ? 'אין בקשות' : `אין בקשות ${getStatusText(filter)}`}
//                     </h3>
//                     <p>
//                         {filter === 'all' 
//                             ? 'כרגע אין לך בקשות שיעורים' 
//                             : `כרגע אין לך בקשות ${getStatusText(filter)}`
//                         }
//                     </p>
//                 </div>
//             ) : (
//                 <div className="requests-container">
//                     <div className="requests-grid">
//                         {filteredRequests.map(request => (
//                             <div key={request.request_id} className="request-card">
//                                 <div className="request-header">
//                                     <div className="request-icon">
//                                         {request.status === 'pending' ? '⏳' : 
//                                          request.status === 'approved' ? '✅' : '❌'}
//                                     </div>
//                                     <div className="request-info">
//                                         <h3 className="request-title">
//                                             בקשה מ: {request.student_name}
//                                         </h3>
//                                         <div className="request-meta">
//                                             <span className="request-date">
//                                                 📅 {formatDate(request.request_date)}
//                                             </span>
//                                             <span className="request-time">
//                                                 🕐 {formatTime(request.end_time)} - {formatTime(request.start_time)}
//                                             </span>
//                                             <span className={`request-status ${getStatusClass(request.status)}`}>
//                                                 {getStatusText(request.status)}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="request-details">
//                                     <div className="request-info-grid">
//                                         <div className="info-item">
//                                             <span className="info-label">תלמיד:</span>
//                                             <span className="info-value">{request.student_name}</span>
//                                         </div>
//                                         <div className="info-item">
//                                             <span className="info-label">אימייל:</span>
//                                             <span className="info-value">{request.student_email}</span>
//                                         </div>
//                                         <div className="info-item">
//                                             <span className="info-label">נשלח בתאריך:</span>
//                                             <span className="info-value">
//                                                 {formatDate(request.requested_date)}
//                                             </span>
//                                         </div>

//                                         {request.note && (
//                                             <div className="info-item note-item">
//                                                 <span className="info-label">הערות מהתלמיד:</span>
//                                                 <span className="info-value note-text">{request.note}</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {request.status === 'pending' && (
//                                     <div className="request-actions">
//                                         <button 
//                                             className="btn-approve"
//                                             onClick={() => handleStatusUpdate(request.request_id, 'approved')}
//                                         >
//                                             ✅ אשר בקשה
//                                         </button>
//                                         <button 
//                                             className="btn-reject"
//                                             onClick={() => handleStatusUpdate(request.request_id, 'rejected')}
//                                         >
//                                             ❌ דחה בקשה
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default TeacherRequests;


import React, { useState, useEffect, useContext } from 'react';
import { userContext } from './App';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleError from '../hooks/useHandleError';
import refreshToken from '../js-files/RefreshToken';
import Cookies from 'js-cookie';
import '../styles/TeacherRequests.css';

function TeacherRequests() {
    const { userData } = useContext(userContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
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
                const response = await fetchData(`lessonRequests/teacher/${userData.user_id}`, '', handleError);

                if (!isMounted) return;

                const requestsData = response?.data || response || [];
                console.log('🔍 Received requests data:', requestsData); // לדיבוג
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
    }, [userData?.user_id]);

    const handleStatusUpdate = async (requestId, status) => {
        try {
            let token = Cookies.get("accessToken");

            const sendRequest = async (token) => {
                return await fetch(`http://localhost:3000/lessonRequests/${requestId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        status,
                        teacher_id: userData.user_id
                    })
                });
            };

            let response = await sendRequest(token);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendRequest(token);
            }

            if (response.ok) {
                const result = await response.json();

                // עדכון הרשימה
                setRequests(prev =>
                    prev.map(req =>
                        req.request_id === requestId
                            ? { ...req, status }
                            : req
                    )
                );

                // הודעת הצלחה
                const message = status === 'approved' ? 'הבקשה אושרה בהצלחה!' : 'הבקשה נדחתה';
                alert(message);
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'שגיאה בעדכון הבקשה');
            }
        } catch (error) {
            console.error('Error updating request:', error);
            alert('שגיאה בעדכון הבקשה');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('he-IL');
    };

    const formatTime = (timeString) => {
        return timeString.substring(0, 5);
    };

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
                                                🕐 {formatTime(request.end_time)} - {formatTime(request.start_time)}
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
                                        <button
                                            className="btn-approve"
                                            onClick={() => handleStatusUpdate(request.request_id, 'approved')}
                                        >
                                            ✅ אשר בקשה
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => handleStatusUpdate(request.request_id, 'rejected')}
                                        >
                                            ❌ דחה בקשה
                                        </button>
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

