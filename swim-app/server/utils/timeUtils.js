function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function hasTimeOverlap(start1, end1, start2, end2) {
    const start1Minutes = timeToMinutes(start1);
    const end1Minutes = timeToMinutes(end1);
    const start2Minutes = timeToMinutes(start2);
    const end2Minutes = timeToMinutes(end2);
    
    console.log('🔍 Checking overlap:', {
        lesson1: `${start1}(${start1Minutes}) - ${end1}(${end1Minutes})`,
        lesson2: `${start2}(${start2Minutes}) - ${end2}(${end2Minutes})`
    });
    
    const overlap = start1Minutes < end2Minutes && end1Minutes > start2Minutes;
    console.log('🔍 Has overlap:', overlap);
    
    return overlap;
}

function calculateGapBetweenLessons(newStart, newEnd, existingStart, existingEnd) {
    const newStartMinutes = timeToMinutes(newStart);
    const newEndMinutes = timeToMinutes(newEnd);
    const existingStartMinutes = timeToMinutes(existingStart);
    const existingEndMinutes = timeToMinutes(existingEnd);
    
    console.log('🔍 Gap calculation:', {
        newLesson: `${newStart}(${newStartMinutes}) - ${newEnd}(${newEndMinutes})`,
        existingLesson: `${existingStart}(${existingStartMinutes}) - ${existingEnd}(${existingEndMinutes})`
    });
    
    if (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes) {
        console.log('🔍 Gap calculation: overlap detected, gap = -1');
        return -1;
    }
    
    let gap;
    
    if (newStartMinutes >= existingEndMinutes) {
        gap = newStartMinutes - existingEndMinutes;
        console.log(`🔍 New lesson starts after existing ends: gap = ${gap} minutes`);
    }
    else if (existingStartMinutes >= newEndMinutes) {
        gap = existingStartMinutes - newEndMinutes;
        console.log(`🔍 Existing lesson starts after new ends: gap = ${gap} minutes`);
    }
    else {
        gap = -1;
        console.log('🔍 Unexpected case in gap calculation');
    }
    
    console.log(`🔍 FINAL GAP: ${gap} minutes`);
    return gap;
}

function checkTimeConflict(newLesson, existingLessons) {
    console.log('🔍 === CHECKING TIME CONFLICTS ===');
    console.log('🔍 New lesson:', {
        start: newLesson.start_time,
        end: newLesson.end_time,
        pool: newLesson.pool_id || newLesson.pool_name
    });
    
    for (const existingLesson of existingLessons) {
        console.log(`\n🔍 Checking against lesson ${existingLesson.lesson_id}:`, {
            start: existingLesson.start_time,
            end: existingLesson.end_time,
            pool: existingLesson.pool_id || existingLesson.pool_name
        });
        
        const hasOverlap = hasTimeOverlap(
            newLesson.start_time,
            newLesson.end_time,
            existingLesson.start_time,
            existingLesson.end_time
        );
        
        if (hasOverlap) {
            console.log('🚫 TIME CONFLICT DETECTED!');
            return existingLesson;
        }
    }
    
    console.log('✅ No time conflicts found');
    return null;
}

function checkQuarterHourWarnings(newLesson, existingLessons) {
    console.log('🔍 === CHECKING QUARTER HOUR WARNINGS ===');
    const warnings = [];
    
    for (const existingLesson of existingLessons) {
        if (existingLesson.pool_id === newLesson.pool_id) {
            console.log(`🔍 Same pool (${existingLesson.pool_id}) - skipping warning check`);
            continue;
        }
        
        const hasOverlap = hasTimeOverlap(
            newLesson.start_time,
            newLesson.end_time,
            existingLesson.start_time,
            existingLesson.end_time
        );
        
        if (!hasOverlap) {
            const gap = calculateGapBetweenLessons(
                newLesson.start_time,
                newLesson.end_time,
                existingLesson.start_time,
                existingLesson.end_time
            );
            
            if (gap >= 0 && gap < 15) {
                console.log(`⚠️ QUARTER HOUR WARNING: ${gap} minutes gap with different pool`);
                warnings.push({
                    type: 'TIGHT_SCHEDULE',
                    message: `שים לב: יש לך שיעור צמוד בזמן ב${existingLesson.pool_name || 'בריכה אחרת'} (מרווח של ${gap} דקות בלבד)`,
                    conflict: existingLesson,
                    gap: gap
                });
            }
        }
    }
    
    console.log(`🔍 Found ${warnings.length} quarter hour warnings`);
    return warnings;
}

module.exports = {
    timeToMinutes,
    hasTimeOverlap,
    calculateGapBetweenLessons,
    checkTimeConflict,
    checkQuarterHourWarnings
};
