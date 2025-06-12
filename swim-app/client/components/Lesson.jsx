import React, { useState, useContext, createContext, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchData } from "../js-files/GeneralRequests";
import '../styles/Lesson.css';
import { userContext } from "./App";
import Update from "./Update";
// import Delete from "./DeleteItem"; 
import AddItem from "./AddItem";
import useHandleError from "./useHandleError";
export const LessonContext = createContext();

const useHandleDisplay = (initialValue) => {
    const [data, setData] = useState(initialValue);

    const updateData = (updatedItem) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
        );
    };

    const deleteData = (id) => {
        setData(prevData => prevData.filter(item => item.id !== id));
    };

    const addData = (newItem) => {
        setData(prevData => [...prevData, newItem]);
    };

    return [data, setData, updateData, deleteData, addData];
};

const LessonsContext = createContext();

function Lesson({ lesson }) {
    const navigate = useNavigate();
    const { id, lessonid } = useParams();
    const [showLesson, setShowLesson] = useState(lessonid == lesson.lesson_id ? true : false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [participants, setParticipants, updateParticipants, deleteParticipants, addParticipants] = useHandleDisplay([]);
    const lessonsContext = useContext(LessonsContext) || {
        updateLessons: () => { },
        deleteLessons: () => { },
        setDisplayChanged: () => { }
    };
    const { updateLessons, deleteLessons, setDisplayChanged } = lessonsContext;
    const { userData } = useContext(userContext);
    const location = useLocation();
    const { handleError } = useHandleError();

    const attributes = ["participant_name", "participant_email", "notes"];

    const isTeacher = userData.type_name === 'teacher';

    function showLessonFunction() {
        setShowLesson(true);
        navigate(`/users/${id}/lessons/${lesson.lesson_id}`);
    }

    useEffect(() => {
        (async function () {
            const hasPath = location.pathname.includes("participants");
            if (hasPath && lesson.lesson_id == lessonid) {
                if (participants.length > 0) {
                    setShowParticipants(true);
                } else {
                    let response = await fetchData("lesson-participants", `lesson_id=${lesson.lesson_id}`, handleError);
                    if (response) {
                        setParticipants(response);
                        setShowParticipants(true);
                    }
                }
            }
        })();
    }, [location.pathname, participants, lesson.lesson_id, lessonid, handleError]);

    function navigateToParticipants() {
        navigate(`/users/${id}/lessons/${lesson.lesson_id}/participants`);
    }

    function getLessonIcon(type) {
        switch (type?.toLowerCase()) {
            case 'private': return '👤';
            case 'group': return '👥';
            default: return '🏊‍♀️';
        }
    }

    function getLevelColor(level) {
        switch (level?.toLowerCase()) {
            case 'beginner': return '#28a745';
            case 'intermediate': return '#ffc107';
            case 'advanced': return '#dc3545';
            default: return '#0066cc';
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL');
    }

    function formatTime(timeString) {
        return timeString?.substring(0, 5);
    }

    function isLessonPast() {
        const lessonDateTime = new Date(`${lesson.lesson_date}T${lesson.start_time}`);
        return lessonDateTime < new Date();
    }

    function translateLessonType(type) {
        switch (type?.toLowerCase()) {
            case 'private': return 'פרטי';
            case 'group': return 'קבוצתי';
            default: return 'לא מוגדר';
        }
    }

    function translateLevel(level) {
        switch (level?.toLowerCase()) {
            case 'beginner': return 'מתחיל';
            case 'intermediate': return 'בינוני';
            case 'advanced': return 'מתקדם';
            default: return 'כללי';
        }
    }

    return (
        <>
            {!showLesson && (
                <div className={`lesson-card ${!lesson.is_active ? 'lesson-inactive' : ''} ${isLessonPast() ? 'lesson-past' : ''}`}>
                    <div className="lesson-header">
                        <div className="lesson-icon">
                            {getLessonIcon(lesson.lesson_type)}
                        </div>
                        <div className="lesson-info">
                            <h3 className="lesson-title">
                                שיעור {translateLessonType(lesson.lesson_type)}
                            </h3>
                            <div className="lesson-meta">
                                <span className="lesson-date">📅 {formatDate(lesson.lesson_date)}</span>
                                <span className="lesson-time">
                                    🕐 {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                                </span>
                                <span
                                    className="lesson-level"
                                    style={{ backgroundColor: getLevelColor(lesson.level) }}
                                >
                                    {translateLevel(lesson.level)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="lesson-details">
                        <div className="lesson-info-grid">
                            <div className="info-item">
                                <span className="info-label"> גילאים:</span>
                                <span className="info-value">{lesson.age_range || 'כל הגילאים'}</span>
                            </div>
                            {lesson.lesson_type === 'group' && (
                                <div className="info-item">
                                    <span className="info-label">מקסימום משתתפים:</span>
                                    <span className="info-value">{lesson.max_participants || 'ללא הגבלה'}</span>
                                </div>
                            )}
                            <div className="info-item">
                                <span className="info-label">בריכה:</span>
                                <span className="info-value">{lesson.pool_name}</span>
                            </div>
                            {isTeacher && (
                                <div className="info-item">
                                    <span className="info-label">נרשמו:</span>
                                    <span className="info-value">
                                        {lesson.num_registered || 0}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lesson-actions">
                        <div className="lesson-actions-right">
                            {isTeacher && lesson.teacher_id == userData.id && (
                                <>
                                    <Update
                                        item={{
                                            id: lesson.lesson_id,
                                            lesson_date: lesson.lesson_date,
                                            start_time: lesson.start_time,
                                            end_time: lesson.end_time,
                                            lesson_type: lesson.lesson_type,
                                            max_participants: lesson.max_participants,
                                            age_range: lesson.age_range,
                                            level: lesson.level
                                        }}
                                        type="lessons"
                                        updateDisplay={updateLessons}
                                        setDisplayChanged={setDisplayChanged}
                                    />
                                    {/* הסר את ההערה אם יש לך את הקומפוננטה Delete */}
                                    {/*
                                    <Delete
                                        id={lesson.lesson_id}
                                        type="lessons"
                                        deleteDisplay={deleteLessons}
                                        setDisplayChanged={setDisplayChanged}
                                        dependent="lesson-participants"
                                    />
                                    */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showLesson && (
                <div className="lesson-overlay">
                    <div className="lesson-modal">
                        <button
                            className="lesson-close-button"
                            onClick={() => {
                                setShowLesson(false);
                                setShowParticipants(false);
                                navigate(`/users/${id}/lessons`);
                            }}
                        >
                            ✕
                        </button>

                        <div className={`lesson-modal-header ${lesson.lesson_type === 'private' ? 'private-lesson' : 'group-lesson'}`}>
                            <div className="lesson-modal-icon">
                                {getLessonIcon(lesson.lesson_type)}
                            </div>
                            <div className="lesson-modal-info">
                                <h2 className="lesson-modal-title">
                                    שיעור {translateLessonType(lesson.lesson_type)}
                                </h2>
                                <div className="lesson-modal-meta">
                                    <span className="lesson-modal-date">📅 {formatDate(lesson.lesson_date)}</span>
                                    <span className="lesson-modal-time">
                                        🕐 {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                                    </span>
                                    <span
                                        className="lesson-modal-level"
                                        style={{ backgroundColor: getLevelColor(lesson.level) }}
                                    >
                                        {translateLevel(lesson.level)}
                                    </span>
                                    <span className={`lesson-modal-status ${lesson.is_confirmed ? 'confirmed' : 'pending'}`}>
                                        {lesson.is_confirmed ? '✓ מאושר' : '⏳ ממתין לאישור'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="lesson-modal-content">
                            <div className="lesson-full-details">
                                <div className="details-grid">
                                    <div className="detail-card">
                                        <h4>פרטי השיעור</h4>
                                        <div className="detail-items">
                                            <div className="detail-item">
                                                <span className="detail-label">סוג שיעור:</span>
                                                <span className="detail-value">
                                                    {translateLessonType(lesson.lesson_type)}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">רמה:</span>
                                                <span className="detail-value">{translateLevel(lesson.level)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">טווח גילאים:</span>
                                                <span className="detail-value">{lesson.age_range || 'כל הגילאים'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">בריכה:</span>
                                                <span className="detail-value">בריכה #{lesson.pool_id}</span>
                                            </div>
                                            {lesson.lesson_type === 'group' && (
                                                <div className="detail-item">
                                                    <span className="detail-label">מקסימום משתתפים:</span>
                                                    <span className="detail-value">{lesson.max_participants || 'ללא הגבלה'}</span>
                                                </div>
                                            )}
                                            {/* הצגת מספר הנרשמים רק למורים */}
                                            {isTeacher && (
                                                <div className="detail-item">
                                                    <span className="detail-label">מספר נרשמים:</span>
                                                    <span className="detail-value">
                                                        {lesson.num_registered || 0}
                                                        {lesson.lesson_type === 'group' && lesson.max_participants &&
                                                            ` מתוך ${lesson.max_participants}`
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {/* הצגת סטטוס פעילות רק למורים */}
                                            {isTeacher && (
                                                <div className="detail-item">
                                                    <span className="detail-label">סטטוס:</span>
                                                    <span className="detail-value">
                                                        {lesson.is_active ? 'פעיל' : 'לא פעיל'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="detail-card">
                                        <h4>זמן ותאריך</h4>
                                        <div className="detail-items">
                                            <div className="detail-item">
                                                <span className="detail-label">תאריך:</span>
                                                <span className="detail-value">{formatDate(lesson.lesson_date)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">תאריך:</span>
                                                <span className="detail-value">{formatDate(lesson.lesson_date)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">שעת התחלה:</span>
                                                <span className="detail-value">{formatTime(lesson.start_time)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">שעת סיום:</span>
                                                <span className="detail-value">{formatTime(lesson.end_time)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">משך השיעור:</span>
                                                <span className="detail-value">
                                                    {Math.round((new Date(`1970-01-01T${lesson.end_time}`) - new Date(`1970-01-01T${lesson.start_time}`)) / 60000)} דקות
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">סטטוס אישור:</span>
                                                <span className="detail-value">
                                                    {lesson.is_confirmed ? 'מאושר' : 'ממתין לאישור'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lesson-modal-actions">
                                <div className="lesson-participants-section">
                                    {lesson.lesson_type === 'group' && !showParticipants && (
                                        <button className="btn-show-participants" onClick={navigateToParticipants}>
                                            הצג משתתפים
                                        </button>
                                    )}

                                    <LessonContext.Provider value={{ updateParticipants, deleteParticipants }}>
                                        <div className="lesson-management">
                                            {isTeacher && lesson.teacher_id === userData.id && (
                                                <AddItem
                                                    keys={attributes}
                                                    type="lesson-participants"
                                                    addDisplay={addParticipants}
                                                    defaultValues={{
                                                        lesson_id: lesson.lesson_id
                                                    }}
                                                />
                                            )}

                                            {showParticipants && (
                                                <div className="lesson-participants-container">
                                                    <h3>משתתפים בשיעור</h3>
                                                    {isTeacher && (
                                                        <div className="participants-summary">
                                                            <span className="participants-count">
                                                                סה"כ נרשמים: {lesson.num_registered || 0}
                                                                {lesson.lesson_type === 'group' && lesson.max_participants &&
                                                                    ` מתוך ${lesson.max_participants}`
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="participants-grid">
                                                        {participants.map((participant) => (
                                                            <div key={participant.id} className="participant-item">
                                                                <h4>{participant.participant_name}</h4>
                                                                <p>{participant.participant_email}</p>
                                                                {participant.notes && (
                                                                    <span className="participant-notes">
                                                                        📝 {participant.notes}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {participants.length === 0 && (
                                                        <div className="no-participants">
                                                            <p>אין משתתפים רשומים לשיעור זה</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </LessonContext.Provider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Lesson;
