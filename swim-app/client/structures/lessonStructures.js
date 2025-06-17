export const getTimeDifferenceInMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;
  return endTotalMin - startTotalMin;
};

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
    placeholder: 'מספר משתתפים',
    readonly: true
  },
  {
    key: 'min_age',
    label: 'גיל מינימום',
    inputType: 'number',
    placeholder: 'גיל מינימום'
  },
  {
    key: 'max_age',
    label: 'גיל מקסימום',
    inputType: 'number',
    placeholder: 'גיל מקסימום'
  }

];

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
  min_age: {
    required: "גיל מינימום הוא שדה חובה",
    validate: (value) => {
      const age = parseInt(value);
      if (isNaN(age) || age < 3 || age > 80) {
        return "גיל מינימום חייב להיות בין 3 ל-80";
      }
      return true;
    }
  },
  max_age: {
    required: "גיל מקסימום הוא שדה חובה",
    validate: (value, { min_age }) => {
      const maxAge = parseInt(value);
      const minAge = parseInt(min_age);
      if (isNaN(maxAge) || maxAge < 3 || maxAge > 80) {
        return "גיל מקסימום חייב להיות בין 3 ל-80";
      }
      if (!isNaN(minAge) && maxAge <= minAge) {
        return "גיל מקסימום חייב להיות גדול מהגיל המינימום";
      }
      return true;
    }
  },

  onFieldChange: (key, value, watchedValues, setValue) => {
    if (key === 'lesson_type') {
      if (value === 'private') {
        const maxParticipantsField = document.getElementById('max_participants');
        if (maxParticipantsField) {
          maxParticipantsField.readOnly = true;
          maxParticipantsField.style.backgroundColor = '#f5f5f5';
          maxParticipantsField.style.cursor = 'not-allowed';
        }
        return { max_participants: 1 };
      } else if (value === 'group') {
        const maxParticipantsField = document.getElementById('max_participants');
        if (maxParticipantsField) {
          maxParticipantsField.readOnly = false;
          maxParticipantsField.style.backgroundColor = '';
          maxParticipantsField.style.cursor = '';
        }
        return { max_participants: '' };
      }
    }
    return null;
  }
});

export const defaultLessonValues = (userId = null) => ({
  lesson_date: '',
  start_time: '',
  end_time: '',
  lesson_type: '',
  level: '',
  pool_id: '',
  max_participants: '',
  min_age: '',
  max_age: '',
  user_id: userId
});

export const createLessonUpdateConfig = (lesson, pools) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  return {
    item: {
      id: lesson.lesson_id,
      lesson_date: formatDateForInput(lesson.lesson_date),
      start_time: formatTimeForInput(lesson.start_time),
      end_time: formatTimeForInput(lesson.end_time),
      lesson_type: lesson.lesson_type,
      max_participants: lesson.max_participants,
      min_age: lesson.min_age,
      max_age: lesson.max_age,
      level: lesson.level,
      pool_id: lesson.pool_id
    },
    type: "lessons",
    nameButton: "עריכת שיעור",
    keys: createLessonKeys(pools),
    validationRules: createLessonValidationRules()
  };
};
