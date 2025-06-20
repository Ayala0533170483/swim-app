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

export const formatLessonValue = (key, value) => {
  if (!value && value !== 0) return '-';
  
  switch (key) {
    case 'lesson_date':
    case 'registration_date':
      return new Date(value).toLocaleDateString('he-IL');
    
    case 'start_time':
    case 'end_time':
      return value.substring(0, 5); 
    
    case 'lesson_type':
      return lessonDisplayValues.lesson_type[value] || value;
    
    case 'level':
      return lessonDisplayValues.level[value] || value;
    
    default:
      return value;
  }
};

export const processLessonForDisplay = (lesson) => {
  return {
    lesson_date: formatLessonValue('lesson_date', lesson.lesson_date),
    time_range: `${formatLessonValue('start_time', lesson.start_time)} - ${formatLessonValue('end_time', lesson.end_time)}`,
    pool_name: lesson.pool_name,
    lesson_type: formatLessonValue('lesson_type', lesson.lesson_type),
    level: formatLessonValue('level', lesson.level),
    age_range: `${lesson.min_age}-${lesson.max_age}`,
    participants_info: `${lesson.num_registered}/${lesson.max_participants}`,
    registration_date: lesson.registration_date ? formatLessonValue('registration_date', lesson.registration_date) : null
  };
};
