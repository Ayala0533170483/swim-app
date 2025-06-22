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

// פונקציה עזר להמרת זמן למספר דקות
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// פונקציה עזר לבדיקת חפיפה בין שני שיעורים
function hasTimeOverlap(start1, end1, start2, end2) {
    const start1Minutes = timeToMinutes(start1);
    const end1Minutes = timeToMinutes(end1);
    const start2Minutes = timeToMinutes(start2);
    const end2Minutes = timeToMinutes(end2);
    
    console.log('🔍 Checking overlap:', {
        lesson1: `${start1}(${start1Minutes}) - ${end1}(${end1Minutes})`,
        lesson2: `${start2}(${start2Minutes}) - ${end2}(${end2Minutes})`
    });
    
    // חפיפה מתרחשת אם: start1 < end2 AND end1 > start2
    const overlap = start1Minutes < end2Minutes && end1Minutes > start2Minutes;
    console.log('🔍 Has overlap:', overlap);
    
    return overlap;
}

// פונקציה מתוקנת לחישוב מרווח בין שיעורים - הבעיה הייתה כאן!
function calculateGapBetweenLessons(newStart, newEnd, existingStart, existingEnd) {
    const newStartMinutes = timeToMinutes(newStart);
    const newEndMinutes = timeToMinutes(newEnd);
    const existingStartMinutes = timeToMinutes(existingStart);
    const existingEndMinutes = timeToMinutes(existingEnd);
    
    console.log('🔍 Gap calculation - DETAILED:', {
        newLesson: `${newStart}(${newStartMinutes}) - ${newEnd}(${newEndMinutes})`,
        existingLesson: `${existingStart}(${existingStartMinutes}) - ${existingEnd}(${existingEndMinutes})`
    });
    
    // בדיקה אם יש חפיפה קודם כל
    if (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes) {
        console.log('🔍 Gap calculation: overlap detected, gap = -1');
        return -1; // מסמן חפיפה
    }
    
    let gap;
    
    // אם השיעור החדש מתחיל אחרי שהקיים מסתיים
    if (newStartMinutes >= existingEndMinutes) {
        gap = newStartMinutes - existingEndMinutes;
        console.log(`🔍 New lesson starts after existing ends: ${existingEnd} -> ${newStart} = ${gap} minutes gap`);
    }
    // אם השיעור הקיים מתחיל אחרי שהחדש מסתיים
    else if (existingStartMinutes >= newEndMinutes) {
        gap = existingStartMinutes - newEndMinutes;
        console.log(`🔍 Existing lesson starts after new ends: ${newEnd} -> ${existingStart} = ${gap} minutes gap`);
    }
    // במקרה של חפיפה (לא אמור להגיע לכאן)
    else {
        gap = -1;
        console.log('🔍 Unexpected overlap case in gap calculation');
    }
    
    console.log(`🔍 FINAL GAP RESULT: ${gap} minutes`);
    return gap;
}

async function createLesson(lessonData) {
    try {
        if (!lessonData.user_id || !lessonData.pool_id || !lessonData.lesson_date) {
            throw new Error('Missing required fields: teacher_id, pool_id, lesson_date');
        }
        
        const teacherId = lessonData.user_id;
        const newPoolId = parseInt(lessonData.pool_id);
        
        console.log('🔍 Creating lesson with data:', {
            teacherId,
            date: lessonData.lesson_date,
            start: lessonData.start_time,
            end: lessonData.end_time,
            pool: newPoolId
        });
        
        // קבלת כל השיעורים הקיימים של המורה באותו תאריך
        const existingLessons = await lessonsService.getTeacherLessonsForDate(
            teacherId,
            lessonData.lesson_date
        );
        
        console.log('🔍 Found existing lessons:', existingLessons.length);
        let warnings = [];
        
        // אם יש שיעורים קיימים - בדוק חפיפות ואזהרות
        if (existingLessons && existingLessons.length > 0) {
            console.log('🔍 Checking conflicts and warnings against existing lessons...');
            
            for (const existingLesson of existingLessons) {
                console.log(`\n🔍 === CHECKING LESSON ${existingLesson.lesson_id} ===`);
                console.log(`   Existing: ${existingLesson.start_time} - ${existingLesson.end_time} (Pool: ${existingLesson.pool_name}, ID: ${existingLesson.pool_id})`);
                console.log(`   New: ${lessonData.start_time} - ${lessonData.end_time} (Pool ID: ${newPoolId})`);
                
                // בדיקת חפיפה בזמן
                const hasOverlap = hasTimeOverlap(
                    lessonData.start_time,
                    lessonData.end_time,
                    existingLesson.start_time,
                    existingLesson.end_time
                );
                
                if (hasOverlap) {
                    console.log('🚫 TIME OVERLAP DETECTED!');
                    
                    // בדיקה אם זה באותה בריכה
                    const isSamePool = existingLesson.pool_id === newPoolId;
                    console.log(`🔍 Same pool check: ${existingLesson.pool_id} === ${newPoolId} = ${isSamePool}`);
                    
                    if (isSamePool) {
                        // חפיפה באותה בריכה - מונע יצירה
                        console.log('🚫 SAME POOL CONFLICT - BLOCKING CREATION');
                        
                        throw new Error(JSON.stringify({
                            type: 'SCHEDULE_CONFLICT',
                            message: 'יש לך שיעור קיים באותה בריכה בזמן חופף',
                            conflicts: [existingLesson]
                        }));
                    } else {
                        // חפיפה בבריכה אחרת - אזהרה חמורה
                        console.log('⚠️ DIFFERENT POOL OVERLAP - SERIOUS WARNING');
                        warnings.push({
                            type: 'OVERLAP_WARNING',
                            message: `אזהרה: יש לך שיעור חופף בזמן ב${existingLesson.pool_name}! זה בלתי אפשרי פיזית`,
                            conflict: existingLesson
                        });
                    }
                } else {
                    // אין חפיפה - בדיקת מרווח לאזהרת צמידות
                    console.log('✅ No overlap - checking gap...');
                    
                    const gap = calculateGapBetweenLessons(
                        lessonData.start_time,
                        lessonData.end_time,
                        existingLesson.start_time,
                        existingLesson.end_time
                    );
                    
                    console.log(`🔍 Gap result: ${gap} minutes`);
                    
                    // אזהרה אם המרווח קטן מ-15 דקות
                    if (gap >= 0 && gap < 15) {
                        const isDifferentPool = existingLesson.pool_id !== newPoolId;
                        
                        console.log(`🔍 Gap check: gap=${gap}, isDifferentPool=${isDifferentPool}`);
                        
                        if (isDifferentPool) {
                            console.log(`⚠️ TIGHT SCHEDULE WARNING: ${gap} minutes gap between different pools`);
                            warnings.push({
                                type: 'TIGHT_SCHEDULE',
                                message: `שים לב: יש לך שיעור צמוד בזמן ב${existingLesson.pool_name} (מרווח של ${gap} דקות בלבד)`,
                                conflict: existingLesson
                            });
                        } else {
                            console.log(`ℹ️ Tight schedule in same pool (${gap} minutes) - no warning needed`);
                        }
                    } else if (gap >= 15) {
                        console.log(`✅ Good gap: ${gap} minutes - no warning needed`);
                    } else if (gap === -1) {
                        console.log(`❌ Gap calculation returned -1 (overlap) - this shouldn't happen here`);
                    }
                }
                console.log(`=== END CHECKING LESSON ${existingLesson.lesson_id} ===\n`);
            }
        }

        // יוצר את השיעור (אם הגענו עד כאן, אין קונפליקטים חוסמים)
        console.log('✅ No blocking conflicts found - creating lesson...');
        
        lessonData.teacher_id = teacherId;
        delete lessonData.user_id;
        const result = await genericService.create('lessons', lessonData);
        console.log('✅ Lesson created successfully');
        
        if (warnings.length > 0) {
            console.log(`⚠️ Created with ${warnings.length} warnings:`, warnings);
        }

        return {
            lesson: result,
            warnings: warnings
        };

    } catch (error) {
        console.error('❌ Error in createLesson:', error.message);
        
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
