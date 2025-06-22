const express = require('express');
const router = express.Router();
const lessonRequestsController = require('../controllers/lessonRequestsController');

// קבלת בקשות של מורה
router.get('/teacher/:teacherId', lessonRequestsController.getTeacherRequests);

// קבלת בקשות של תלמיד  
router.get('/student/:studentId', lessonRequestsController.getStudentRequests);

// קבלת רשימת מורים
router.get('/teachers', lessonRequestsController.getTeachers);

// יצירת בקשה חדשה (זה מה שAddItem יקרא)
router.post('/', lessonRequestsController.createRequest);

// עדכון סטטוס בקשה
router.put('/:requestId/status', lessonRequestsController.updateRequestStatus);

module.exports = router;
