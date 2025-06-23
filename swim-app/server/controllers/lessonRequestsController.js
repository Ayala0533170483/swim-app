const lessonRequestsService = require('../services/lessonRequestsService');
const usersController = require('../controllers/usersController');
const { sendLessonRequestStatusEmail } = require('./emailController');

async function createRequest(req, res) {
    try {
        const { 
            student_id, 
            teacher_id, 
            pool_id, 
            request_date, 
            start_time, 
            end_time, 
            min_age, 
            max_age, 
            level, 
            note 
        } = req.body;
        
        const requestData = {
            student_id,
            teacher_id,
            pool_id,
            request_date,
            start_time,
            end_time,
            min_age,
            max_age,
            level,
            note: note || null,
            requested_date: new Date(),
            status: 'pending'
        };
        
        const result = await lessonRequestsService.createRequest(requestData);
        
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

async function getTeacherRequests(req, res) {
    try {
        const teacherId = req.user.id;
        
        const requests = await lessonRequestsService.getTeacherRequests(teacherId);
        
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

async function getStudentRequests(req, res) {
    try {
        const studentId = req.user.id;
        
        const requests = await lessonRequestsService.getStudentRequests(studentId);
        
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

async function getTeachers(req, res) {
    try {
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

async function updateRequestStatus(req, res) {
    try {
        const { requestId } = req.params;
        const { status } = req.body;
        const teacherId = req.user.id;
        
        // קבל את פרטי הבקשה לפני העדכון
        const existingRequest = await lessonRequestsService.getRequestById(requestId, teacherId);
        
        if (!existingRequest || existingRequest.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'בקשה לא נמצאה'
            });
        }

        const requestData = existingRequest[0];
        
        // עדכן את הסטטוס (הטריגר יטפל ביצירת השיעור)
        await lessonRequestsService.updateRequestStatus(requestId, { status });
        
        // שלח מייל לתלמיד
        try {
            await sendLessonRequestStatusEmail(
                requestData.student_email,
                requestData.student_name,
                requestData.teacher_name,
                requestData,
                status
            );
        } catch (emailError) {
            console.error('Failed to send status email:', emailError);
            // ממשיכים גם אם המייל נכשל
        }
        
        res.json({
            success: true,
            message: status === 'approved' ? 'הבקשה אושרה ושיעור נוצר במערכת' : 'הבקשה נדחתה'
        });
        
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בעדכון הבקשה'
        });
    }
}

// הוסף את הפונקציה הזו בסוף הקונטרולר:

async function deleteRequest(req, res) {
    try {
        const { requestId } = req.params;
        const teacherId = req.user.id;
        
        // קבל את פרטי הבקשה לפני המחיקה
        const existingRequest = await lessonRequestsService.getRequestById(requestId, teacherId);
        
        if (!existingRequest || existingRequest.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'בקשה לא נמצאה'
            });
        }

        const requestData = existingRequest[0];
        
        // עדכן את הסטטוס לנדחה
        await lessonRequestsService.updateRequestStatus(requestId, { status: 'rejected' });
        
        // שלח מייל לתלמיד
        try {
            await sendLessonRequestStatusEmail(
                requestData.student_email,
                requestData.student_name,
                requestData.teacher_name,
                requestData,
                'rejected'
            );
        } catch (emailError) {
            console.error('Failed to send rejection email:', emailError);
        }
        
        res.json({
            success: true,
            message: 'הבקשה נדחתה'
        });
        
    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בדחיית הבקשה'
        });
    }
}

module.exports = {
    createRequest,
    getTeacherRequests,
    getStudentRequests,
    getTeachers,
    updateRequestStatus,
    deleteRequest  
};
