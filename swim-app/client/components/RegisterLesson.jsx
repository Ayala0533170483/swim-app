// import React, { useState, useEffect, useContext } from 'react';
// import { userContext } from './App';
// import { fetchData } from '../js-files/GeneralRequests';
// import useHandleError from './useHandleError';
// import Lesson from './Lesson';
// import '../styles/RegisterLesson.css';

// export const RegisterLessonsContext = React.createContext();

// function RegisterLesson() {
//     const { userData } = useContext(userContext);
//     const [availableLessons, setAvailableLessons] = useState([]);
//     const [pools, setPools] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [filter, setFilter] = useState({
//         lessonType: 'all',
//         level: 'all',
//         poolId: 'all'
//     });
//     const { handleError } = useHandleError(); 

//     // *** הוספה חדשה - פונקציה לטיפול ברישום מוצלח ***
//     const handleRegistrationSuccess = (registrationData) => {
//         console.log('Registration successful:', registrationData);
        
//         // הסר את השיעור מהרשימה
//         if (registrationData && registrationData.lesson_id) {
//             setAvailableLessons(prev => 
//                 prev.filter(lesson => lesson.lesson_id !== registrationData.lesson_id)
//             );
//         }
        
//         // הודעת הצלחה
//         alert('🎉 נרשמת בהצלחה לשיעור!');
//     };

//     useEffect(() => {
//         let isMounted = true;
//         const fetchPools = async () => {
//             try {
//                 const poolsResponse = await fetchData('pools', '', handleError);

//                 if (!isMounted) return;

//                 if (poolsResponse && poolsResponse.success && poolsResponse.data) {
//                     setPools(poolsResponse.data);
//                 } else if (poolsResponse && Array.isArray(poolsResponse)) {
//                     setPools(poolsResponse);
//                 } else {
//                     setPools([]);
//                 }
//             } catch (error) {
//                 if (isMounted) {
//                     console.error('Error fetching pools:', error);
//                     setPools([]);
//                 }
//             }
//         };

//         fetchPools();
//         return () => {
//             isMounted = false;
//         };
//     }, []);

//     useEffect(() => {
//         let isMounted = true;
//         const loadAvailableLessons = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 console.log('Loading available lessons...');
                
//                 const response = await fetchData('lessons', '', handleError);
//                 console.log('Response from server:', response);
                
//                 if (!isMounted) return;
                
//                 const lessons = response?.data || response || [];
//                 setAvailableLessons(lessons);
//                 console.log('Available lessons loaded:', lessons.length);
                
//             } catch (err) {
//                 if (isMounted) {
//                     console.error('Error loading lessons:', err);
//                     setError('שגיאה בטעינת השיעורים');
//                 }
//             } finally {
//                 if (isMounted) {
//                     setLoading(false);
//                 }
//             }
//         };

//         loadAvailableLessons();
//         return () => {
//             isMounted = false;
//         };
//     }, []);

//     const filteredLessons = availableLessons.filter(lesson => {
//         if (filter.lessonType !== 'all' && lesson.lesson_type !== filter.lessonType) return false;
//         if (filter.level !== 'all' && lesson.level !== filter.level) return false;
//         if (filter.poolId !== 'all' && lesson.pool_id !== parseInt(filter.poolId)) return false;
//         return true;
//     });

//     if (!userData) {
//         return <div className="loading">טוען נתוני משתמש...</div>;
//     }

//     if (loading) {
//         return <div className="register-lesson-container">טוען שיעורים...</div>;
//     }

//     if (error) {
//         return (
//             <div className="register-lesson-container">
//                 <div className="error">{error}</div>
//                 <button onClick={() => window.location.reload()}>נסה שוב</button>
//             </div>
//         );
//     }

//     return (
//         <RegisterLessonsContext.Provider value={{
//             addRegistration: handleRegistrationSuccess, // *** הוספה חדשה ***
//             mode: 'register'
//         }}>
//             <div className="register-lesson-container">
//                 <div className="page-header">
//                     <h1>רישום לשיעור חדש</h1>
//                     <p>בחר שיעור מהרשימה להירשם אליו</p>
//                 </div>

//                 <div className="filters-section">
//                     <div className="filter-group">
//                         <label>סוג שיעור:</label>
//                         <select 
//                             value={filter.lessonType} 
//                             onChange={(e) => setFilter({...filter, lessonType: e.target.value})}
//                         >
//                             <option value="all">הכל</option>
//                             <option value="group">קבוצתי</option>
//                             <option value="private">פרטי</option>
//                         </select>
//                     </div>

//                     <div className="filter-group">
//                         <label>רמה:</label>
//                         <select 
//                             value={filter.level} 
//                             onChange={(e) => setFilter({...filter, level: e.target.value})}
//                         >
//                             <option value="all">הכל</option>
//                             <option value="beginner">מתחיל</option>
//                             <option value="intermediate">בינוני</option>
//                             <option value="advanced">מתקדם</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="lessons-container">
//                     {filteredLessons.length === 0 ? (
//                         <div className="no-lessons">
//                             <h3>אין שיעורים זמינים</h3>
//                             <p>
//                                 {availableLessons.length === 0 ? 
//                                     'אין שיעורים זמינים כרגע' : 
//                                     'אין שיעורים התואמים לפילטרים שנבחרו'
//                                 }
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="lessons-grid">
//                             {filteredLessons.map(lesson => (
//                                 <Lesson
//                                     key={lesson.lesson_id}
//                                     lesson={lesson}
//                                     pools={pools}
//                                     mode="register"
//                                 />
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </RegisterLessonsContext.Provider>
//     );
// }

// export default RegisterLesson;
// const express = require('express');
// const router = express.Router();
// const lessonsController = require('../controllers/lessonsController');

// // router.get('/', async (req, res) => {
// //     try {
// //         let query = { ...req.query };
// //         if (query.user_id == null && req.user && req.user.id) {
// //             query = { 'user_id': req.user.id };
// //         }
// //           const filters = {
// //             role: req.user.role,  // התפקיד מהטוקן
// //             id: req.user.id       // ה-ID מהטוקן
// //         };
// //         const lessons = await lessonsController.getLessons(filters);
// //         res.json({ data: lessons });
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });
// router.get('/', async (req, res) => {
//     try {
//         if (Object.keys(req.query).length === 0) {
//             const studentId = req.user.id;
//             const availableLessons = await lessonsController.getAvailableLessons(studentId);
//             return res.json({ data: availableLessons });
//         }

//         let query = { ...req.query };
//         if (query.user_id == null && req.user && req.user.id) {
//             query = { 'user_id': req.user.id };
//         }
//         const filters = {
//             role: req.user.role,
//             id: req.user.id
//         };
//         const lessons = await lessonsController.getLessons(filters);
//         res.json({ data: lessons });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// router.post('/', async (req, res) => {
//     try {
//         const lessonData = req.body;

//         const newLesson = await lessonsController.createLesson(lessonData);

//         res.status(201).json({
//             success: true,
//             data: newLesson,
//             message: 'Lesson created successfully'
//         });

//     } catch (error) {
//         console.error('Error creating lesson:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error creating lesson',
//             error: error.message
//         });
//     }
// });

// router.post('/register', async (req, res) => {
//     try {
//         const registrationData = {
//             lesson_id: req.body.lesson_id,
//             student_id: req.body.student_id || req.user.id
//         };

//         const newRegistration = await lessonsController.registerToLesson(registrationData);

//         res.status(201).json({
//             success: true,
//             data: newRegistration,
//             message: '🎉 נרשמת בהצלחה לשיעור!'
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: '❌ שגיאה ברישום לשיעור',
//             error: error.message
//         });
//     }
// });


// router.put('/:id', async (req, res) => {
//     try {
//         const lesson_id = req.params.id;
//         const updateData = req.body;

//         const result = await lessonsController.updateLesson(lesson_id, updateData);

//         res.json({
//             success: true,
//             message: result.message
//         });

//     } catch (error) {
//         console.error('Error updating lesson:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error updating lesson',
//             error: error.message
//         });
//     }
// });

// router.delete('/:id', async (req, res) => {
//     try {
//         const lessonId = req.params.id;

//         await lessonsController.deleteLesson(lessonId);

//         res.json({
//             success: true,
//             message: 'Lesson deleted successfully'
//         });

//     } catch (error) {
//         console.error('Error deleting lesson:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error deleting lesson',
//             error: error.message
//         });
//     }
// });

// module.exports = router;
import React, { useState, useEffect, useContext } from 'react';
import { userContext } from './App';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleError from './useHandleError';
import Lesson from './Lesson';
import '../styles/RegisterLesson.css';

export const RegisterLessonsContext = React.createContext();

function RegisterLesson() {
    const { userData } = useContext(userContext);
    const [availableLessons, setAvailableLessons] = useState([]);
    const [pools, setPools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // *** הוספה חדשה - state להודעת הצלחה ***
    const [successMessage, setSuccessMessage] = useState('');
    
    const [filter, setFilter] = useState({
        lessonType: 'all',
        level: 'all',
        poolId: 'all'
    });
    const { handleError } = useHandleError(); 

    // *** עדכן את הפונקציה ***
    const handleRegistrationSuccess = (registrationData) => {
        console.log('Registration successful:', registrationData);
        
        // הסר את השיעור מהרשימה
        if (registrationData && registrationData.lesson_id) {
            setAvailableLessons(prev => 
                prev.filter(lesson => lesson.lesson_id !== registrationData.lesson_id)
            );
        }
        
        // הצג הודעת הצלחה במקום alert
        setSuccessMessage('🎉 הרישום לשיעור בוצע בהצלחה!');
        
        // הסתר את ההודעה אחרי 5 שניות
        setTimeout(() => {
            setSuccessMessage('');
        }, 5000);
    };

    useEffect(() => {
        let isMounted = true;
        const fetchPools = async () => {
            try {
                const poolsResponse = await fetchData('pools', '', handleError);

                if (!isMounted) return;

                if (poolsResponse && poolsResponse.success && poolsResponse.data) {
                    setPools(poolsResponse.data);
                } else if (poolsResponse && Array.isArray(poolsResponse)) {
                    setPools(poolsResponse);
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
        const loadAvailableLessons = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Loading available lessons...');
                
                const response = await fetchData('lessons', '', handleError);
                console.log('Response from server:', response);
                
                if (!isMounted) return;
                
                const lessons = response?.data || response || [];
                setAvailableLessons(lessons);
                console.log('Available lessons loaded:', lessons.length);
                
            } catch (err) {
                if (isMounted) {
                    console.error('Error loading lessons:', err);
                    setError('שגיאה בטעינת השיעורים');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadAvailableLessons();
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredLessons = availableLessons.filter(lesson => {
        if (filter.lessonType !== 'all' && lesson.lesson_type !== filter.lessonType) return false;
        if (filter.level !== 'all' && lesson.level !== filter.level) return false;
        if (filter.poolId !== 'all' && lesson.pool_id !== parseInt(filter.poolId)) return false;
        return true;
    });

    if (!userData) {
        return <div className="loading">טוען נתוני משתמש...</div>;
    }

    if (loading) {
        return <div className="register-lesson-container">טוען שיעורים...</div>;
    }

    if (error) {
        return (
            <div className="register-lesson-container">
                <div className="error">{error}</div>
                <button onClick={() => window.location.reload()}>נסה שוב</button>
            </div>
        );
    }

    return (
        <RegisterLessonsContext.Provider value={{
            addRegistration: handleRegistrationSuccess,
            mode: 'register'
        }}>
            <div className="register-lesson-container">
                <div className="page-header">
                    <h1>רישום לשיעור חדש</h1>
                    <p>בחר שיעור מהרשימה להירשם אליו</p>
                </div>

                {/* *** הוספה חדשה - הודעת הצלחה *** */}
                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                <div className="filters-section">
                    <div className="filter-group">
                        <label>סוג שיעור:</label>
                        <select 
                            value={filter.lessonType} 
                            onChange={(e) => setFilter({...filter, lessonType: e.target.value})}
                        >
                            <option value="all">הכל</option>
                            <option value="group">קבוצתי</option>
                            <option value="private">פרטי</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>רמה:</label>
                        <select 
                            value={filter.level} 
                            onChange={(e) => setFilter({...filter, level: e.target.value})}
                        >
                            <option value="all">הכל</option>
                            <option value="beginner">מתחיל</option>
                            <option value="intermediate">בינוני</option>
                            <option value="advanced">מתקדם</option>
                        </select>
                    </div>
                </div>

                <div className="lessons-container">
                    {filteredLessons.length === 0 ? (
                        <div className="no-lessons">
                            <h3>אין שיעורים זמינים</h3>
                            <p>
                                {availableLessons.length === 0 ? 
                                    'אין שיעורים זמינים כרגע' : 
                                    'אין שיעורים התואמים לפילטרים שנבחרו'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="lessons-grid">
                            {filteredLessons.map(lesson => (
                                <Lesson
                                    key={lesson.lesson_id}
                                    lesson={lesson}
                                    pools={pools}
                                    mode="register"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </RegisterLessonsContext.Provider>
    );
}

export default RegisterLesson;
