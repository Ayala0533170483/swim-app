// import React, { useState, useContext } from "react";
// import '../styles/Lesson.css';
// import '../styles/Update.css';
// import { LessonsContext } from "./MyLessons";
// import { RegisterLessonsContext } from "./RegisterLesson";
// import { userContext } from "./App";
// import Update from "./Update";
// import AddItem from "./AddItem";
// import Delete from "./DeleteItem";
// import {
//     createLessonUpdateConfig,
//     getLessonIcon,
//     getLevelColor,
//     formatAgeRange,
//     formatDate,
//     formatTime,
//     translateLessonType,
//     translateLevel
// } from "../structures/lessonStructures";

// function Lesson({ lesson, pools, mode = "view" }) {
//     const { userData } = useContext(userContext);

//     const lessonsContext = useContext(LessonsContext);
//     const registerContext = useContext(RegisterLessonsContext);

//     const { updateLessons, deleteLessons } = lessonsContext || {};
//     const { addRegistration } = registerContext || {};

//     const [showParticipants, setShowParticipants] = useState(false);

//     const isTeacher = userData?.type_name === 'teacher';
//     const isRegisterMode = mode === 'register';
//     const isConflictMode = mode === 'conflict';
//     const hasRegistrations = lesson.registrations && lesson.registrations.length > 0;
//     const numRegistrations = lesson.registrations ? lesson.registrations.length : 0;

//     const updateConfig = createLessonUpdateConfig(lesson, pools);

//     return (
//         <div className={`lesson-card ${isConflictMode ? 'conflict-lesson-card' : ''}`}>
//             <div className="lesson-header">
//                 <div className="lesson-icon">
//                     {getLessonIcon(lesson.lesson_type)}
//                 </div>
//                 <div className="lesson-info">
//                     <h3 className="lesson-title">
//                         שיעור {translateLessonType(lesson.lesson_type)}
//                     </h3>
//                     <div className="lesson-meta">
//                         <span className="lesson-date">📅 {formatDate(lesson.lesson_date)}</span>
//                         <span className="lesson-time">
//                             🕐 {formatTime(lesson.end_time)} - {formatTime(lesson.start_time)}
//                         </span>
//                         <span
//                             className="lesson-level"
//                             style={{ backgroundColor: getLevelColor(lesson.level) }}
//                         >
//                             {translateLevel(lesson.level)}
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             <div className="lesson-details">
//                 <div className="lesson-info-grid">
//                     <div className="info-item">
//                         <span className="info-label">בריכה:</span>
//                         <span className="info-value">{lesson.pool_name}</span>
//                     </div>

//                     {isRegisterMode ? (
//                         <>
//                             <div className="info-item">
//                                 <span className="info-label">מורה:</span>
//                                 <span className="info-value">{lesson.teacher_name}</span>
//                             </div>
//                             <div className="info-item">
//                                 <span className="info-label">טווח גילאים:</span>
//                                 <span className="info-value">{formatAgeRange(lesson.min_age, lesson.max_age)}</span>
//                             </div>
//                             <div className="info-item">
//                                 <span className="info-label">מקומות פנויים:</span>
//                                 <span className="info-value available-spots">
//                                     {lesson.available_spots}
//                                 </span>
//                             </div>
//                         </>
//                     ) : isConflictMode ? (
//                         <>
//                             <div className="info-item">
//                                 <span className="info-label">טווח גילאים:</span>
//                                 <span className="info-value">{formatAgeRange(lesson.min_age, lesson.max_age)}</span>
//                             </div>
//                         </>
//                     ) : (
//                         isTeacher && (
//                             <>
//                                 <div className="info-item">
//                                     <span className="info-label">טווח גילאים:</span>
//                                     <span className="info-value">{formatAgeRange(lesson.min_age, lesson.max_age)}</span>
//                                 </div>
//                                 <div className="info-item">
//                                     <span className="info-label">מספר נרשמים:</span>
//                                     <span className="info-value">{numRegistrations}</span>
//                                 </div>
//                             </>
//                         )
//                     )}
//                 </div>
//             </div>

//             {/* הסתרת כפתורים במצב conflict */}
//             {!isConflictMode && (
//                 <div className="lesson-actions">
//                     {isRegisterMode ? (
//                         <AddItem
//                             type="registerLessons"
//                             addDisplay={addRegistration}
//                             defaltValues={{
//                                 lesson_id: lesson.lesson_id,
//                                 student_id: userData?.user_id,
//                                 action: "register"
//                             }}
//                             nameButton="הצטרף לשיעור"
//                             keys={[]}
//                             validationRules={{}}
//                             useContactStyle={true}
//                         />
//                     ) : (
//                         <div className="lesson-actions-right">
//                             {isTeacher && hasRegistrations && (
//                                 <button
//                                     onClick={() => setShowParticipants(!showParticipants)}
//                                     className="btn-show-participants"
//                                 >
//                                     {showParticipants ? 'הסתר משתתפים' : `הצג משתתפים `}
//                                 </button>
//                             )}

//                             {isTeacher && !hasRegistrations && (
//                                 <>
//                                     <Update
//                                         {...updateConfig}
//                                         updateDisplay={updateLessons}
//                                         setDisplayChanged={() => { }}
//                                     />
//                                     <Delete
//                                         id={lesson.lesson_id}
//                                         type="lessons"
//                                         deleteDisplay={deleteLessons}
//                                         nameButton="מחיקת השיעור"
//                                     />
//                                 </>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {!isRegisterMode && !isConflictMode && showParticipants && hasRegistrations && (
//                 <div className="participants-section">
//                     <h4>משתתפים בשיעור:</h4>
//                     <div className="participants-list">
//                         {lesson.registrations.map((registration) => (
//                             <div key={registration.registration_id} className="participant-item">
//                                 <div className="participant-info">
//                                     <span className="participant-id">{registration.name}</span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Lesson;
import React, { useState, useContext } from "react";
import '../styles/Lesson.css';
import '../styles/Update.css';
import { LessonsContext } from "./MyLessons";
import { RegisterLessonsContext } from "./RegisterLesson";
import { userContext } from "./App";
import Update from "./Update";
import AddItem from "./AddItem";
import Delete from "./DeleteItem";
import CalendarModal from "./CalendarModal";
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

function Lesson({ lesson, pools, mode = "view" }) {
    const { userData } = useContext(userContext);

    const lessonsContext = useContext(LessonsContext);
    const registerContext = useContext(RegisterLessonsContext);

    const { updateLessons, deleteLessons } = lessonsContext || {};
    const { addRegistration } = registerContext || {};

    const [showParticipants, setShowParticipants] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const isTeacher = userData?.type_name === 'teacher';
    const isRegisterMode = mode === 'register';
    const isConflictMode = mode === 'conflict';
    const hasRegistrations = lesson.registrations && lesson.registrations.length > 0;
    const numRegistrations = lesson.registrations ? lesson.registrations.length : 0;

    const updateConfig = createLessonUpdateConfig(lesson, pools);

    const openCalendar = () => {
        setIsCalendarOpen(true);
    };

    const closeCalendar = () => {
        setIsCalendarOpen(false);
    };

    return (
        <div className={`lesson-card ${isConflictMode ? 'conflict-lesson-card' : ''}`}>
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
                
                {!isConflictMode && (
                    <div className="lesson-header-actions">
                        <button 
                            className="calendar-icon-btn" 
                            onClick={openCalendar}
                            title="הצג בלוח שנה"
                        >
                            📅
                        </button>
                    </div>
                )}
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

            {!isConflictMode && (
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

            {!isRegisterMode && !isConflictMode && showParticipants && hasRegistrations && (
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

            <CalendarModal
                isOpen={isCalendarOpen}
                onClose={closeCalendar}
                selectedDate={lesson.lesson_date}
                lessonTitle={`שיעור ${translateLessonType(lesson.lesson_type)} - ${translateLevel(lesson.level)}`}
            />
        </div>
    );
}

export default Lesson;
