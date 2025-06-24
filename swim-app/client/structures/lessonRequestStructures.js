import { createLessonKeys, createLessonValidationRules } from './lessonStructures';

export const createLessonRequestKeys = (teachers = [], pools = []) => {
    return [
        {
            key: 'teacher_id',
            label: 'בחר מורה',
            type: 'select',
            placeholder: 'בחר מורה',
            options: teachers.map(teacher => ({
                value: teacher.user_id,
                label: teacher.name
            }))
        },
        {
            key: 'pool_id',
            label: 'בחר בריכה',
            type: 'select',
            placeholder: 'בחר בריכה',
            options: pools.map(pool => ({
                value: pool.pool_id,
                label: `${pool.name} - ${pool.city}`
            }))
        },
        ...createLessonKeys(pools).filter(key => 
            ['lesson_date', 'start_time', 'end_time', 'lesson_type', 'level', 'max_participants', 'min_age', 'max_age'].includes(key.key)
        ).map(key => {
            if (key.key === 'lesson_date') {
                return { ...key, key: 'request_date', label: 'תאריך השיעור המבוקש' };
            }
            return key;
        }),
        {
            key: 'note',
            label: 'הערות למורה',
            type: 'textarea',
            placeholder: 'הערות נוספות למורה (אופציונלי)',
            required: false,
            rows: 3
        }
    ];
};

export const createLessonRequestValidationRules = () => {
    return {
        teacher_id: { 
            required: 'יש לבחור מורה' 
        },
        pool_id: { 
            required: 'יש לבחור בריכה' 
        },
        ...createLessonValidationRules(),
        request_date: createLessonValidationRules().lesson_date
    };
};
