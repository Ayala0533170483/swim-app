export const getTimeDifferenceInMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;
  return endTotalMin - startTotalMin;
};

export const getLessonIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'private': return '👤';
    case 'group': return '👥';
    default: return '🏊‍♀️';
  }
};

export const getLevelColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'beginner': return '#28a745';
    case 'intermediate': return '#ffc107';
    case 'advanced': return '#dc3545';
    default: return '#0066cc';
  }
};

export const formatAgeRange = (minAge, maxAge) => {
  if (!minAge && !maxAge) return 'כל הגילאים';
  if (!minAge) return `עד גיל ${maxAge}`;
  if (!maxAge) return `מגיל ${minAge}`;
  return `${minAge}-${maxAge}`;
};

export const formatDate = (dateString) => {
  // בדיקה אם התאריך קיים
  if (!dateString) {
    console.log('❌ formatDate: dateString is null/undefined:', dateString);
    return 'תאריך לא זמין';
  }

  try {
    // נסה לנקות את התאריך אם הוא מכיל זמן
    let cleanDateString = dateString;
    if (typeof dateString === 'string' && dateString.includes('T')) {
      cleanDateString = dateString.split('T')[0];
    }

    console.log('🔍 formatDate input:', dateString, 'cleaned:', cleanDateString);
    
    const date = new Date(cleanDateString);
    
    // בדיקה אם התאריך תקין
    if (isNaN(date.getTime())) {
      console.log('❌ formatDate: Invalid date created from:', dateString);
      return 'תאריך לא תקין';
    }

    console.log('✅ formatDate: Valid date created:', date);
    
    return date.toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('❌ formatDate error:', error, 'for dateString:', dateString);
    return 'שגיאה בתאריך';
  }
};


export const formatTime = (timeString) => {
  return timeString?.substring(0, 5);
};

export const translateLessonType = (type) => {
  switch (type?.toLowerCase()) {
    case 'private': return 'פרטי';
    case 'group': return 'קבוצתי';
    default: return 'לא מוגדר';
  }
};

export const translateLevel = (level) => {
  switch (level?.toLowerCase()) {
    case 'beginner': return 'מתחיל';
    case 'intermediate': return 'בינוני';
    case 'advanced': return 'מתקדם';
    default: return 'כללי';
  }
};

export const formatLessonDetails = (lesson) => {
  return {
    title: `${getLessonIcon(lesson.lesson_type)} ${translateLessonType(lesson.lesson_type)} - ${translateLevel(lesson.level)}`,
    type: translateLessonType(lesson.lesson_type),
    level: translateLevel(lesson.level),
    ageRange: formatAgeRange(lesson.min_age, lesson.max_age),
    timeRange: `${formatTime(lesson.start_time)} - ${formatTime(lesson.end_time)}`,
    duration: getTimeDifferenceInMinutes(lesson.start_time, lesson.end_time),
    poolInfo: lesson.pool_name || 'לא צויין',
    maxParticipants: lesson.max_participants || 'לא מוגבל',
    formattedDate: formatDate(lesson.lesson_date)
  };
};

export const getEventStyleByLevel = (level) => {
  const backgroundColor = getLevelColor(level);

  return {
    style: {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block',
      fontSize: '12px',
      padding: '2px 5px',
      fontWeight: 'bold'
    }
  };
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

// הוסף את הפונקציות החסרות בסוף הקובץ:
export const formatConflictLessonForModal = (conflictLesson) => {
  return {
    lesson_id: conflictLesson.lesson_id,
    lesson_date: conflictLesson.lesson_date,
    start_time: conflictLesson.start_time,
    end_time: conflictLesson.end_time,
    lesson_type: conflictLesson.lesson_type,
    level: conflictLesson.level,
    pool_name: conflictLesson.pool_name,
    pool_id: conflictLesson.pool_id,
    min_age: conflictLesson.min_age,
    max_age: conflictLesson.max_age,
    registrations: [] // אין רישומים להציג במודל
  };
};

export const getWarningIcon = (warningType) => {
  switch (warningType) {
    case 'SCHEDULE_CONFLICT':
      return '❌';
    case 'TIGHT_SCHEDULE':
      return '⚠️';
    case 'OVERLAP_WARNING':
      return '🚨';
    default:
      return '⚠️';
  }
};

export const getWarningTitle = (warningType) => {
  switch (warningType) {
    case 'SCHEDULE_CONFLICT':
      return 'שיעור קיים באותו זמן';
    case 'TIGHT_SCHEDULE':
      return 'שים לב - לוח זמנים צפוף';
    case 'OVERLAP_WARNING':
      return 'אזהרה חמורה - חפיפה בזמן';
    default:
      return 'שים לב';
  }
};
// הוסף את הפונקציה הזו בסוף הקובץ:

export const convertLessonToCalendarEvent = (lesson) => {
  console.log('🔍 Processing lesson:', lesson);

  let startDate, endDate;

  try {
    if (lesson.date && lesson.start_time) {
      console.log('📅 Using date + time format');
      startDate = new Date(lesson.date + 'T' + lesson.start_time);
      endDate = new Date(lesson.date + 'T' + lesson.end_time);
    }
    else if (lesson.start && lesson.end) {
      console.log('📅 Using start/end format');
      startDate = new Date(lesson.start);
      endDate = new Date(lesson.end);
    }
    else if (lesson.lesson_date) {
      console.log('📅 Using lesson_date format');
      const dateStr = lesson.lesson_date.split('T')[0];
      startDate = new Date(dateStr + 'T' + (lesson.start_time || '10:00'));
      endDate = new Date(dateStr + 'T' + (lesson.end_time || '11:00'));
    }
    else {
      console.log('📅 Using default dates');
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0);
    }

    console.log('✅ Final dates - Start:', startDate, 'End:', endDate);

  } catch (error) {
    console.error('❌ Error parsing lesson date:', lesson, error);
    const now = new Date();
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0);
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0);
  }

  const event = {
    id: lesson.lesson_id,
    title: lesson.title || `שיעור ${translateLessonType(lesson.lesson_type || '')}`,
    start: startDate,
    end: endDate,
    location: lesson.pool_name || 'לא צויין',
    description: `רמה: ${translateLevel(lesson.level || '')}`,
    // שמירת כל הנתונים המקוריים לשימוש במודל
    lesson_type: lesson.lesson_type,
    level: lesson.level,
    pool_id: lesson.pool_id,
    min_age: lesson.min_age,
    max_age: lesson.max_age,
    teacher_name: lesson.teacher_name,
    registrations: lesson.registrations
  };

  console.log('🎯 Final event:', event);
  return event;
};

export const getLessonDetailsMessage = (event) => {
  return `🏊‍♂️ ${event.title}
🕒 ${format(event.start, 'HH:mm', { locale: he })} - ${format(event.end, 'HH:mm', { locale: he })}
📅 ${format(event.start, 'dd/MM/yyyy', { locale: he })}
📍 ${event.location}
${event.description ? `📝 ${event.description}` : ''}`;
};

