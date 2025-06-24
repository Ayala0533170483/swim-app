const express = require('express');
const router = express.Router();
const lessonRequestsController = require('../controllers/lessonRequestsController');

router.post('/', (req, res) => {
    const { student_id, teacher_id, request_date, start_time, end_time } = req.body;

    if (!student_id || !teacher_id || !request_date || !start_time || !end_time) {
        return res.status(400).json({
            success: false,
            message: 'חסרים נתונים נדרשים'
        });
    }

    lessonRequestsController.createRequest(req, res);
});

router.get('/', (req, res) => {
    const role = req.user.role;

    if (role) {
        const functionName = `get${role.charAt(0).toUpperCase() + role.slice(1)}Requests`;
        lessonRequestsController[functionName](req, res);
    } else {
        return res.status(403).json({
            success: false,
            message: 'גישה לא מורשית'
        });
    }
});

router.get('/', (req, res) => {
    const role = req.user.role;
    const functionName = `get${role.charAt(0).toUpperCase() + role.slice(1)}Requests`;
    lessonRequestsController[functionName](req, res);
});

router.put('/:requestId', (req, res) => {
    const { status } = req.body;
    const userRole = req.user.role;

    if (userRole !== 'teacher') {
        return res.status(403).json({
            success: false,
            message: 'רק מורים יכולים לעדכן סטטוס בקשות'
        });
    }

    if (!status || !['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'סטטוס לא תקין'
        });
    }

    lessonRequestsController.updateRequestStatus(req, res);
});

router.delete('/:requestId', (req, res) => {
    const userRole = req.user.role;

    if (userRole !== 'teacher') {
        return res.status(403).json({
            success: false,
            message: 'רק מורים יכולים למחוק בקשות'
        });
    }

    lessonRequestsController.deleteRequest(req, res);
});

module.exports = router;
