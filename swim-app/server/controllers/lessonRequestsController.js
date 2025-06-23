// const pool = require('../services/connection');

// // יצירת בקשה חדשה
// async function createRequest(req, res) {
//     try {
//         const { student_id, teacher_id, request_date, start_time, end_time, note } = req.body;
        
//         const sql = `
//             INSERT INTO lesson_requests 
//             (student_id, teacher_id, request_date, start_time, end_time, note, requested_date, status, is_active)
//             VALUES (?, ?, ?, ?, ?, ?, NOW(), 'pending', 1)
//         `;
        
//         const [result] = await pool.query(sql, [
//             student_id, teacher_id, request_date, start_time, end_time, note || null
//         ]);
        
//         // החזר את הבקשה החדשה
//         const [newRequest] = await pool.query(`
//             SELECT lr.*, u.name as teacher_name 
//             FROM lesson_requests lr
//             JOIN users u ON lr.teacher_id = u.user_id
//             WHERE lr.request_id = ?
//         `, [result.insertId]);
        
//         res.json({
//             success: true,
//             message: 'הבקשה נשלחה בהצלחה',
//             data: newRequest[0]
//         });
        
//     } catch (error) {
//         console.error('Error creating lesson request:', error);
//         res.status(500).json({
//             success: false,
//             message: 'שגיאה ביצירת הבקשה'
//         });
//     }
// }

// // קבלת בקשות של מורה
// async function getTeacherRequests(req, res) {
//     try {
//         const { teacherId } = req.params;
        
//         const sql = `
//             SELECT lr.*, 
//                    s.name as student_name, 
//                    s.email as student_email
//             FROM lesson_requests lr
//             JOIN users s ON lr.student_id = s.user_id
//             WHERE lr.teacher_id = ? AND lr.is_active = 1
//             ORDER BY lr.requested_date DESC
//         `;
        
//         const [requests] = await pool.query(sql, [teacherId]);
        
//         res.json({
//             success: true,
//             data: requests
//         });
        
//     } catch (error) {
//         console.error('Error fetching teacher requests:', error);
//         res.status(500).json({
//             success: false,
//             message: 'שגיאה בטעינת הבקשות'
//         });
//     }
// }

// // קבלת בקשות של תלמיד
// async function getStudentRequests(req, res) {
//     try {
//         const { studentId } = req.params;
        
//         const sql = `
//             SELECT lr.*, 
//                    t.name as teacher_name
//             FROM lesson_requests lr
//             JOIN users t ON lr.teacher_id = t.user_id
//             WHERE lr.student_id = ? AND lr.is_active = 1
//             ORDER BY lr.requested_date DESC
//         `;
        
//         const [requests] = await pool.query(sql, [studentId]);
        
//         res.json({
//             success: true,
//             data: requests
//         });
        
//     } catch (error) {
//         console.error('Error fetching student requests:', error);
//         res.status(500).json({
//             success: false,
//             message: 'שגיאה בטעינת הבקשות'
//         });
//     }
// }

// // קבלת רשימת מורים
// async function getTeachers(req, res) {
//     try {
//         const sql = `
//             SELECT user_id, name, email 
//             FROM users 
//             WHERE type_name = 'teacher' AND is_active = 1
//             ORDER BY name
//         `;
        
//         const [teachers] = await pool.query(sql);
        
//         res.json({
//             success: true,
//             data: teachers
//         });
        
//     } catch (error) {
//         console.error('Error fetching teachers:', error);
//         res.status(500).json({
//             success: false,
//             message: 'שגיאה בטעינת המורים'
//         });
//     }
// }

// // עדכון סטטוס בקשה
// async function updateRequestStatus(req, res) {
//     try {
//         const { requestId } = req.params;
//         const { status, teacher_id } = req.body;
        
//         // וודא שהמורה מעדכן רק את הבקשות שלו
//         const sql = `
//             UPDATE lesson_requests 
//             SET status = ? 
//             WHERE request_id = ? AND teacher_id = ? AND is_active = 1
//         `;
        
//         const [result] = await pool.query(sql, [status, requestId, teacher_id]);
        
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'בקשה לא נמצאה'
//             });
//         }
        
//         res.json({
//             success: true,
//             message: status === 'approved' ? 'הבקשה אושרה' : 'הבקשה נדחתה'
//         });
        
//     } catch (error) {
//         console.error('Error updating request status:', error);
//         res.status(500).json({
//             success: false,
//             message: 'שגיאה בעדכון הבקשה'
//         });
//     }
// }

// module.exports = {
//     createRequest,
//     getTeacherRequests,
//     getStudentRequests,
//     getTeachers,
//     updateRequestStatus
// };


const genericService = require('../services/genericService');
const usersController = require('../controllers/usersController');

// יצירת בקשה חדשה - דרך הסרוויס הגנרי
async function createRequest(req, res) {
    try {
        const { student_id, teacher_id, request_date, start_time, end_time, note } = req.body;
        
        const requestData = {
            student_id,
            teacher_id,
            request_date,
            start_time,
            end_time,
            note: note || null,
            requested_date: new Date(),
            status: 'pending'
        };
        
        // שימוש בסרוויס הגנרי
        const result = await genericService.create('lesson_requests', requestData);
        
        res.json({
            success: true,
            message: 'הבקשה נשלחה בהצלחה',
            data: result
        });
        
    } catch (error) {
        console.error('Error creating lesson request:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה ביצירת הבקשה'
        });
    }
}

// קבלת בקשות של מורה
async function getTeacherRequests(req, res) {
    try {
        const { teacherId } = req.params;
        
        // שימוש בסרוויס הגנרי
        const requests = await genericService.get('lesson_requests', { 
            teacher_id: teacherId
        });
        
        res.json({
            success: true,
            data: requests
        });
        
    } catch (error) {
        console.error('Error fetching teacher requests:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בטעינת הבקשות'
        });
    }
}

// קבלת בקשות של תלמיד
async function getStudentRequests(req, res) {
    try {
        const { studentId } = req.params;
        
        // שימוש בסרוויס הגנרי
        const requests = await genericService.get('lesson_requests', { 
            student_id: studentId
        });
        
        res.json({
            success: true,
            data: requests
        });
        
    } catch (error) {
        console.error('Error fetching student requests:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בטעינת הבקשות'
        });
    }
}

// קבלת רשימת מורים - דרך הקונטרולר הקיים
async function getTeachers(req, res) {
    try {
        // שימוש בקונטרולר המשתמשים הקיים
        const teachers = await usersController.getUsers({ type: 'teachers' });
        
        res.json({
            success: true,
            data: teachers
        });
        
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בטעינת המורים'
        });
    }
}

// עדכון סטטוס בקשה
async function updateRequestStatus(req, res) {
    try {
        const { requestId } = req.params;
        const { status, teacher_id } = req.body;
        
        // בדיקה שהמורה מעדכן רק את הבקשות שלו
        const existingRequest = await genericService.get('lesson_requests', { 
            request_id: requestId,
            teacher_id: teacher_id
        });
        
        if (!existingRequest || existingRequest.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'בקשה לא נמצאה'
            });
        }
        
        // עדכון הסטטוס
        await genericService.update('lesson_requests', requestId, { status });
        
        res.json({
            success: true,
            message: status === 'approved' ? 'הבקשה אושרה' : 'הבקשה נדחתה'
        });
        
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בעדכון הבקשה'
        });
    }
}

module.exports = {
    createRequest,
    getTeacherRequests,
    getStudentRequests,
    getTeachers,
    updateRequestStatus
};
