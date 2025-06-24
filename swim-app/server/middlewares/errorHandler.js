const errorHandler = (err, req, res, next) => {

    if (err.message === 'Access token required') {
        return res.status(401).json({
            error: 'Access token required'
        });
    }
    
    if (err.message && err.message.startsWith('{"type":"SCHEDULE_CONFLICT"')) {
        try {
            const conflictData = JSON.parse(err.message);
            return res.status(409).json({
                success: false,
                type: 'SCHEDULE_CONFLICT',
                message: conflictData.message,
                conflicts: conflictData.conflicts
            });
        } catch (parseError) {
            console.error('Error parsing conflict data:', parseError);
        }
    }

    if (err.name === 'JsonWebTokenError' || err.message.includes('token')) {
        return res.status(401).json({
            success: false,
            message: 'גישה לא מורשית',
            error: err.message
        });
    }

    if (err.message.includes('required') || err.message.includes('נדרש')) {
        return res.status(400).json({
            success: false,
            message: err.message,
            error: err.message
        });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'גודל התמונה גדול מדי (מקסימום 5MB)',
            error: err.message
        });
    }

    if (err.message.includes('רק קבצי תמונה מותרים') || err.message.includes('סוג קובץ לא נתמך')) {
        return res.status(400).json({
            success: false,
            message: err.message,
            error: err.message
        });
    }

    if (err.message.includes('in use') || err.message.includes('כבר קיים')) {
        return res.status(409).json({
            success: false,
            message: err.message,
            error: err.message
        });
    }

    if (err.message.includes('גישה לא מורשית') || err.message.includes('unauthorized')) {
        return res.status(403).json({
            success: false,
            message: 'אין לך הרשאה לבצע פעולה זו',
            error: err.message
        });
    }

    if (err.message.includes('IP mismatch')) {
        return res.status(403).json({
            success: false,
            message: 'גישה לא מורשית',
            error: 'IP mismatch'
        });
    }

    return res.status(500).json({
        success: false,
        message: 'שגיאה בשרת',
        error: err.message
    });
};

module.exports = errorHandler;
