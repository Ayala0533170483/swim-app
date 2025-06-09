// פונקציות עזר
export const getTimeDifferenceInMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;
  return endTotalMin - startTotalMin;
};

// פונקציות סטטוס
export const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed': return 'confirmed';
    case 'pending': return 'pending';
    case 'cancelled': return 'cancelled';
    default: return 'pending';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'confirmed': return 'מאושר';
    case 'pending': return 'ממתין לאישור';
    case 'cancelled': return 'מבוטל';
    default: return 'ממתין לאישור';
  }
};

// הגדרת מפתחות השיעור
export const createLessonKeys = (pools) => [
  {
    key: 'lesson_date',
    label: 'תאריך השיעור',
    inputType: 'date',
    placeholder: 'בחר תאריך'
  },
  {
    key: 'start_time',
    label: 'שעת התחלה',
    inputType: 'time',
    placeholder: 'HH:MM'
  },
  {
    key: 'end_time',
    label: 'שעת סיום',
    inputType: 'time',
    placeholder: 'HH:MM'
  },
  {
    key: 'lesson_type',
    label: 'סוג השיעור',
    type: 'select',
    placeholder: 'בחר סוג שיעור',
    options: [
      { value: 'private', label: 'פרטי' },
      { value: 'group', label: 'קבוצתי' }
    ]
  },
  {
    key: 'level',
    label: 'רמה',
    type: 'select',
    placeholder: 'בחר רמה',
    options: [
      { value: 'beginner', label: 'מתחיל' },
      { value: 'intermediate', label: 'בינוני' },
      { value: 'advanced', label: 'מתקדם' }
    ]
  },
  {
    key: 'pool_id',
    label: 'בריכה',
    type: 'select',
    placeholder: 'בחר בריכה',
    options: pools && pools.length > 0
      ? pools.map(pool => ({
        value: pool.pool_id,
        label: `${pool.name} - ${pool.city}`
      }))
      : [{ value: '', label: 'טוען בריכות...' }]
  },
  {
    key: 'max_participants',
    label: 'מקסימום משתתפים',
    inputType: 'number',
    placeholder: 'מספר משתתפים'
  },
  {
    key: 'age_range',
    label: 'טווח גילאים',
    placeholder: 'לדוגמה: 6-12'
  }
];

// חוקי ולידציה
export const createLessonValidationRules = () => ({
  lesson_date: {
    required: "תאריך השיעור הוא שדה חובה",
    validate: (value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today || "התאריך חייב להיות היום או בעתיד";
    }
  },
  start_time: {
    required: "שעת התחלה היא שדה חובה",
    pattern: {
      value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: "פורמט שעה לא תקין (HH:MM)"
    }
  },
  end_time: {
    required: "שעת סיום היא שדה חובה",
    pattern: {
      value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: "פורמט שעה לא תקין (HH:MM)"
    },
    validate: (value, { start_time }) => {
      if (!start_time) return true;
      const diffMinutes = getTimeDifferenceInMinutes(start_time, value);
      if (diffMinutes <= 0) {
        return "שעת סיום חייבת להיות אחרי שעת התחלה";
      }
      if (diffMinutes < 40) {
        return "השיעור חייב להיות לפחות 40 דקות";
      }
      if (diffMinutes > 90) {
        return "השיעור לא יכול להיות יותר משעה וחצי";
      }
      return true;
    }
  },
  lesson_type: {
    required: "סוג השיעור הוא שדה חובה"
  },
  level: {
    required: "רמה היא שדה חובה"
  },
  pool_id: {
    required: "בריכה היא שדה חובה"
  },
  max_participants: {
    required: "מספר משתתפים הוא שדה חובה",
    validate: (value, { lesson_type }) => {
      if (lesson_type === 'private') return true;
      const participants = parseInt(value);
      if (isNaN(participants)) {
        return "מספר משתתפים חייב להיות מספר";
      }
      if (lesson_type === 'group') {
        if (participants < 2) {
          return "שיעור קבוצתי חייב להיות לפחות 2 משתתפים";
        }
        if (participants > 10) {
          return "שיעור קבוצתי מקסימום 10 משתתפים";
        }
      }
      return true;
    }
  },
  age_range: {
    required: "טווח גילאים הוא שדה חובה",
    minLength: {
      value: 3,
      message: "טווח גילאים חייב להכיל לפחות 3 תווים"
    }
  },
  onFieldChange: (key, value, watchedValues, setValue) => {
    if (key === 'lesson_type') {
      if (value === 'private') {
        return { max_participants: 1 };
      } else if (value === 'group') {
        return { max_participants: '' };
      }
    }
    return null;
  }
});

// ערכי ברירת מחדל
export const defaultLessonValues = {
  lesson_date: '',
  start_time: '',
  end_time: '',
  lesson_type: '',
  level: '',
  pool_id: '',
  max_participants: '',
  age_range: ''
};
