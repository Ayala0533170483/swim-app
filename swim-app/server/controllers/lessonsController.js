const genericService = require('../services/genericService');
const lessonsService = require('../services/lessonsService');

async function getMyLessons(filters = {}) {
    try {
        const rawLessons = await lessonsService.getMyLessons(filters);
        console.log(`Found ${rawLessons.length} lesson records`);
        const lessonsMap = new Map();

        rawLessons.forEach(row => {
            const lessonId = row.lesson_id;

            if (!lessonsMap.has(lessonId)) {
                lessonsMap.set(lessonId, {
                    lesson_id: row.lesson_id,
                    teacher_id: row.teacher_id,
                    pool_id: row.pool_id,
                    pool_name: row.pool_name,
                    lesson_date: row.lesson_date,
                    start_time: row.start_time,
                    end_time: row.end_time,
                    lesson_type: row.lesson_type,
                    max_participants: row.max_participants,
                    min_age: row.min_age,
                    max_age: row.max_age,
                    level: row.level,
                    registrations: []
                });
            }

            if (row.registration_id) {
                lessonsMap.get(lessonId).registrations.push({
                    registration_id: row.registration_id,
                    student_id: row.student_id,
                    name: row.name,
                    registration_date: row.registration_date,
                    status: row.status
                });
            }
        });
        const processedLessons = Array.from(lessonsMap.values());
        console.log(`Processed into ${processedLessons.length} unique lessons`);

        return processedLessons;
    } catch (error) {
        console.error('=== ERROR getting lessons ===');
        console.error('Error message:', error.message);
        console.error('=== END ERROR ===');
        throw error;
    }
}

async function getAvailableLessons(studentId) {
    try {
        const availableLessons = await lessonsService.getAvailableLessons(studentId);
        console.log(`Found ${availableLessons.length} available lessons`);
        return availableLessons;
    } catch (error) {
        throw error;
    }
}

async function createLesson(lessonData) {
    try {
        if (!lessonData.user_id || !lessonData.pool_id || !lessonData.lesson_date) {
            throw new Error('Missing required fields: teacher_id, pool_id, lesson_date');
        }
        
        const teacherId = lessonData.user_id;
        
        console.log('🔍 Creating lesson with data:', {
            teacherId,
            date: lessonData.lesson_date,
            start: lessonData.start_time,
            end: lessonData.end_time,
            pool: lessonData.pool_id
        });
        
        // בדיקת חפיפות בלוח הזמנים של המורה
        const conflicts = await lessonsService.checkTeacherScheduleConflicts(
            teacherId,
            lessonData.lesson_date,
            lessonData.start_time,
            lessonData.end_time
        );

        console.log('🔍 Found conflicts:', conflicts);

        let warnings = [];
        
        if (conflicts.length > 0) {
            console.log('⚠️ Processing conflicts...');
            
            // בדיקה אם יש חפיפה באותה בריכה
            const samePoolConflicts = conflicts.filter(conflict => {
                const isSamePool = conflict.pool_id === parseInt(lessonData.pool_id);
                console.log(`🔍 Conflict ${conflict.lesson_id}: pool ${conflict.pool_id} vs ${lessonData.pool_id} = ${isSamePool}`);
                return isSamePool;
            });
            
            if (samePoolConflicts.length > 0) {
                // חפיפה באותה בריכה - מונע יצירה
                console.log('🚫 Same pool conflicts found:', samePoolConflicts);
                
                throw new Error(JSON.stringify({
                    type: 'SCHEDULE_CONFLICT',
                    message: 'יש לך שיעור קיים באותה בריכה בזמן חופף',
                    conflicts: samePoolConflicts
                }));
            }
            
            // בדיקת צפיפות (פחות מ-15 דקות) בבריכות אחרות
            const getTimeInMinutes = (timeStr) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + minutes;
            };
            
            const newStartMinutes = getTimeInMinutes(lessonData.start_time);
            const newEndMinutes = getTimeInMinutes(lessonData.end_time);
            
            console.log('🔍 New lesson time range:', newStartMinutes, '-', newEndMinutes);
            
            conflicts.forEach(conflict => {
                const conflictStartMinutes = getTimeInMinutes(conflict.start_time);
                const conflictEndMinutes = getTimeInMinutes(conflict.end_time);
                
                console.log(`🔍 Existing lesson ${conflict.lesson_id} time range:`, conflictStartMinutes, '-', conflictEndMinutes);
                
                // חישוב המרווח בין השיעורים
                let minGap = Infinity;
                
                if (newEndMinutes <= conflictStartMinutes) {
                    // השיעור החדש נגמר לפני שהקיים מתחיל
                    minGap = conflictStartMinutes - newEndMinutes;
                    console.log(`🔍 New lesson ends before existing starts. Gap: ${minGap} minutes`);
                } else if (newStartMinutes >= conflictEndMinutes) {
                    // השיעור החדש מתחיל אחרי שהקיים נגמר
                    minGap = newStartMinutes - conflictEndMinutes;
                    console.log(`🔍 New lesson starts after existing ends. Gap: ${minGap} minutes`);
                } else {
                    // יש חפיפה - זה לא אמור לקרות כי זה כבר נבדק ב-SQL
                    console.log('🚫 Overlapping lessons detected!');
                    minGap = 0;
                }
                
                if (minGap < 15 && minGap >= 0) {
                    console.log(`⚠️ Tight schedule detected! Gap: ${minGap} minutes`);
                    warnings.push({
                        type: 'TIGHT_SCHEDULE',
                        message: `שים לב: יש לך שיעור צמוד בזמן ב${conflict.pool_name} (מרווח של ${minGap} דקות בלבד)`,
                        conflict: conflict
                    });
                }
            });
        }

        console.log('✅ Creating lesson...');
        
        // יצירת השיעור
        lessonData.teacher_id = teacherId;
        delete lessonData.user_id;
        const result = await genericService.create('lessons', lessonData);

        console.log('✅ Lesson created successfully');

        return {
            lesson: result,
            warnings: warnings
        };

    } catch (error) {
        console.error('❌ Error in createLesson:', error.message);
        
        // אם זה שגיאת חפיפה, נזרוק אותה כמו שהיא
        if (error.message.startsWith('{"type":"SCHEDULE_CONFLICT"')) {
            throw error;
        }
        throw error;
    }
}

async function updateLesson(lessonId, updateData) {
    try {
        delete updateData.registrations;
        delete updateData.id;
        await genericService.update('lessons', lessonId, updateData);
        return { message: 'Lesson updated successfully' };
    } catch (error) {
        throw error;
    }
}

async function deleteLesson(lessonId) {
    try {
        console.log(`=== Deleting lesson ID: ${lessonId} ===`);
        const result = await genericService.remove('lessons', lessonId);
        console.log('Lesson deleted successfully');
        return result;
    } catch (error) {
        console.error('Error in deleteLesson:', error);
        throw error;
    }
}

module.exports = {
    getMyLessons,
    getAvailableLessons,
    createLesson,
    updateLesson,
    deleteLesson 
};
