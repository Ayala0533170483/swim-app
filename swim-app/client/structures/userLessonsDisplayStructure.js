// מיפוי תרגומים לעברית
export const lessonDisplayLabels = {
  lesson_date: 'תאריך השיעור',
  start_time: 'שעת התחלה',
  end_time: 'שעת סיום',
  lesson_type: 'סוג השיעור',
  level: 'רמה',
  pool_name: 'בריכה',
  min_age: 'גיל מינימום',
  max_age: 'גיל מקסימום',
  max_participants: 'מקסימום משתתפים',
  num_registered: 'רשומים',
  registration_date: 'תאריך הרשמה'
};

// תרגום ערכים לעברית
export const lessonDisplayValues = {
  lesson_type: {
    'private': 'פרטי',
    'group': 'קבוצתי'
  },
  level: {
    'beginner': 'מתחיל',
    'intermediate': 'בינוני',
    'advanced': 'מתקדם'
  }
};

// פורמט תצוגה לכל שדה
export const formatLessonValue = (key, value) => {
  if (!value && value !== 0) return '-';
  
  switch (key) {
    case 'lesson_date':
    case 'registration_date':
      return new Date(value).toLocaleDateString('he-IL');
    
    case 'start_time':
    case 'end_time':
      return value.substring(0, 5); // HH:MM
    
    case 'lesson_type':
      return lessonDisplayValues.lesson_type[value] || value;
    
    case 'level':
      return lessonDisplayValues.level[value] || value;
    
    case 'participants_info':
      // מקבל אובייקט עם num_registered ו max_participants
      return `${value.registered}/${value.max}`;
    
    case 'age_range':
      // מקבל אובייקט עם min_age ו max_age
      return `${value.min}-${value.max}`;
    
    default:
      return value;
  }
};

// הגדרת השדות שיוצגו ובאיזה סדר
export const getLessonDisplayFields = (userType) => {
  const baseFields = [
    { key: 'lesson_date', label: lessonDisplayLabels.lesson_date },
    { key: 'time_range', label: 'שעות השיעור' },
    { key: 'pool_name', label: lessonDisplayLabels.pool_name },
    { key: 'lesson_type', label: lessonDisplayLabels.lesson_type },
    { key: 'level', label: lessonDisplayLabels.level },
    { key: 'age_range', label: 'טווח גילאים' },
    { key: 'participants_info', label: 'משתתפים' }
  ];

  // עבור תלמידים, הוסף תאריך הרשמה
  if (userType === 'students') {
    baseFields.push({ 
      key: 'registration_date', 
      label: lessonDisplayLabels.registration_date 
    });
  }

  return baseFields;
};

// עיבוד נתוני שיעור לתצוגה
export const processLessonForDisplay = (lesson) => {
  return {
    ...lesson,
    time_range: `${formatLessonValue('start_time', lesson.start_time)} - ${formatLessonValue('end_time', lesson.end_time)}`,
    age_range: {
      min: lesson.min_age,
      max: lesson.max_age
    },
    participants_info: {
      registered: lesson.num_registered,
      max: lesson.max_participants
    }
  };
};
