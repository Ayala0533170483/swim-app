import React, { useState, useContext } from "react";
import '../styles/Lesson.css';
import '../styles/Update.css';
import { LessonsContext } from "./MyLessons";
import { RegisterLessonsContext } from "./RegisterLesson";
import { userContext } from "./App";
import Update from "./Update";
import AddItem from "./AddItem";
import Delete from "./DeleteItem";
import { createLessonUpdateConfig } from "../structures/lessonStructures";

function Lesson({ lesson, pools, mode = "view" }) {
    const { userData } = useContext(userContext);

    const lessonsContext = useContext(LessonsContext);
    const registerContext = useContext(RegisterLessonsContext);

    const { updateLessons, deleteLessons } = lessonsContext || {};
    const { addRegistration } = registerContext || {};

    const [showParticipants, setShowParticipants] = useState(false);

    const isTeacher = userData?.type_name === 'teacher';
    const isRegisterMode = mode === 'register';
    const hasRegistrations = lesson.registrations && lesson.registrations.length > 0;
    const numRegistrations = lesson.registrations ? lesson.registrations.length : 0;

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

    const updateConfig = createLessonUpdateConfig(lesson, pools);

    return (
        <div className="lesson-card">
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
                            🕐 {formatTime(lesson.end_time)} - {formatTime(lesson.start_time)}
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
                        <span className="info-label">בריכה:</span>
                        <span className="info-value">{lesson.pool_name}</span>
                    </div>

                    {isRegisterMode ? (
                        <>
                            <div className="info-item">
                                <span className="info-label">מורה:</span>
                                <span className="info-value">{lesson.teacher_name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">טווח גילאים:</span>
                                <span className="info-value">{lesson.age_range || 'כל הגילאים'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">מקומות פנויים:</span>
                                <span className="info-value available-spots">
                                    {lesson.available_spots} מתוך {lesson.max_participants}
                                </span>
                            </div>
                        </>
                    ) : (
                        isTeacher && (
                            <>
                                <div className="info-item">
                                    <span className="info-label">טווח גילאים:</span>
                                    <span className="info-value">{lesson.age_range || 'כל הגילאים'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">מספר נרשמים:</span>
                                    <span className="info-value">{numRegistrations}</span>
                                </div>
                            </>
                        )
                    )}
                </div>
            </div>

            <div className="lesson-actions">
                {isRegisterMode ? (
                    <AddItem
                        type="registerLessons"
                        addDisplay={addRegistration}
                        defaltValues={{
                            lesson_id: lesson.lesson_id,
                            student_id: userData?.user_id,
                            action: "register"
                        }}
                        nameButton="הצטרף לשיעור"
                        keys={[]}
                        validationRules={{}}
                        useContactStyle={true}
                    />
                ) : (
                    <div className="lesson-actions-right">
                        {isTeacher && hasRegistrations && (
                            <button
                                onClick={() => setShowParticipants(!showParticipants)}
                                className="btn-show-participants"
                            >
                                {showParticipants ? 'הסתר משתתפים' : `הצג משתתפים `}
                            </button>
                        )}

                        {isTeacher && !hasRegistrations && (
                            <>
                                <Update
                                    {...updateConfig}
                                    updateDisplay={updateLessons}
                                    setDisplayChanged={() => { }}
                                />
                                <Delete
                                    id={lesson.lesson_id}
                                    type="lessons"
                                    deleteDisplay={deleteLessons}
                                    nameButton="מחיקת השיעור"
                                />
                            </>
                        )}
                    </div>
                )}
            </div>

            {!isRegisterMode && showParticipants && hasRegistrations && (
                <div className="participants-section">
                    <h4>משתתפים בשיעור:</h4>
                    <div className="participants-list">
                        {lesson.registrations.map((registration) => (
                            <div key={registration.registration_id} className="participant-item">
                                <div className="participant-info">
                                    <span className="participant-id">{registration.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Lesson;
