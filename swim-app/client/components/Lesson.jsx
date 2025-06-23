import React, { useState, useContext } from "react";
import '../styles/Lesson.css';
import '../styles/Update.css';
import '../styles/LessonModal.css'; // נוסיף קובץ CSS חדש למודל
import { LessonsContext } from "./MyLessons";
import { RegisterLessonsContext } from "./RegisterLesson";
import { userContext } from "./App";
import Update from "./Update";
import AddItem from "./AddItem";
import Delete from "./DeleteItem";
import {
    createLessonUpdateConfig,
    getLessonIcon,
    getLevelColor,
    formatAgeRange,
    formatDate,
    formatTime,
    translateLessonType,
    translateLevel
} from "../structures/lessonStructures";

function Lesson({ lesson, pools, mode = "view", showAsModal = false }) {
    const { userData } = useContext(userContext);

    const lessonsContext = useContext(LessonsContext);
    const registerContext = useContext(RegisterLessonsContext);

    const { updateLessons, deleteLessons } = lessonsContext || {};
    const { addRegistration } = registerContext || {};

    const [showParticipants, setShowParticipants] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(showAsModal);

    const isTeacher = userData?.type_name === 'teacher';
    const isRegisterMode = mode === 'register';
    const isConflictMode = mode === 'conflict';
    const hasRegistrations = lesson.registrations && lesson.registrations.length > 0;
    const numRegistrations = lesson.registrations ? lesson.registrations.length : 0;

    const updateConfig = createLessonUpdateConfig(lesson, pools);

    // פונקציות לניהול המודל
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // טיפול בלחיצה על הרקע
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    // טיפול בלחיצה על ESC
    React.useEffect(() => {
        if (isModalOpen) {
            const handleEsc = (e) => {
                if (e.keyCode === 27) {
                    closeModal();
                }
            };
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // מונע גלילה ברקע

            return () => {
                document.removeEventListener('keydown', handleEsc);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isModalOpen]);

    // תוכן השיעור (אותו JSX כמו קודם)
    const lessonContent = (
        <div className={`lesson-card ${isConflictMode ? 'conflict-lesson-card' : ''} ${showAsModal ? 'lesson-modal-content' : ''}`}>
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
                                <span className="info-value">{formatAgeRange(lesson.min_age, lesson.max_age)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">מקומות פנויים:</span>
                                <span className="info-value available-spots">
                                    {lesson.available_spots}
                                </span>
                            </div>
                        </>
                    ) : isConflictMode ? (
                        <>
                            <div className="info-item">
                                <span className="info-label">טווח גילאים:</span>
                                <span className="info-value">{formatAgeRange(lesson.min_age, lesson.max_age)}</span>
                            </div>
                        </>
                    ) : (
                        isTeacher && (
                            <>
                                <div className="info-item">
                                    <span className="info-label">טווח גילאים:</span>
                                    <span className="info-value">{formatAgeRange(lesson.min_age, lesson.max_age)}</span>
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

            {!isConflictMode && !showAsModal && (
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
            )}

            {!isRegisterMode && !isConflictMode && !showAsModal && showParticipants && hasRegistrations && (
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

    // אם showAsModal = false, מחזיר את התוכן הרגיל
    if (!showAsModal) {
        return lessonContent;
    }

    // אם showAsModal = true, מחזיר את התוכן במודל
    if (!isModalOpen) {
        return null;
    }

    return (
        <div className="lesson-modal-overlay" onClick={handleOverlayClick}>
            <div className="lesson-modal">
                <button className="lesson-modal-close" onClick={closeModal}>
                    ✕
                </button>
                {lessonContent}
            </div>
        </div>
    );
}

export default Lesson;
