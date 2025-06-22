

// module.exports = router;
const express = require('express');
const router = express.Router();
const lessonRequestsController = require('../controllers/lessonRequestsController');

// יצירת בקשה חדשה
router.post('/', lessonRequestsController.createRequest);

// קבלת בקשות של מורה
router.get('/teacher/:teacherId', lessonRequestsController.getTeacherRequests);

// קבלת בקשות של תלמיד
router.get('/student/:studentId', lessonRequestsController.getStudentRequests);

// עדכון סטטוס בקשה
router.put('/:requestId/status', lessonRequestsController.updateRequestStatus);

// קבלת רשימת מורים - זה מה שחסר!
router.get('/teachers', async (req, res) => {
    try {
        console.log('🔍 LessonRequests - Teachers endpoint called');

        const sql = `
            SELECT u.user_id, u.name, u.email 
            FROM users u
            JOIN user_types ut ON u.type_id = ut.type_id
            WHERE ut.type_name = 'teacher' AND u.is_active = 1
            ORDER BY u.name
        `;

        const pool = require('../services/connection');
        const [teachers] = await pool.query(sql);

        console.log(`🔍 Found ${teachers.length} teachers for lesson requests`);

        res.json({
            success: true,
            data: teachers
        });

    } catch (error) {
        console.error('❌ Error fetching teachers for lesson requests:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בטעינת המורים',
            error: error.message
        });
    }
});

module.exports = router;
