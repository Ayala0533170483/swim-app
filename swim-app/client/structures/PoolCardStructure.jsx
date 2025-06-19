// הגדרות שדות לעדכון
export const updateKeys = [
  { key: 'name', label: 'שם הבריכה', type: 'input' },
  { key: 'city', label: 'עיר', type: 'input' },
  { key: 'address', label: 'כתובת', type: 'input' },
  { key: 'phone', label: 'טלפון', type: 'input' },
  { key: 'description', label: 'תיאור', type: 'textarea' },
  { key: 'latitude', label: 'קו רוחב', type: 'input' },
  { key: 'longitude', label: 'קו אורך', type: 'input' }
];

// הגדרות שדות להוספה (עם פרטים נוספים)
export const addKeys = [
  { 
    key: 'name', 
    label: 'שם הבריכה', 
    type: 'input', 
    placeholder: 'הכנס שם בריכה' 
  },
  { 
    key: 'city', 
    label: 'עיר', 
    type: 'input', 
    placeholder: 'הכנס עיר' 
  },
  { 
    key: 'address', 
    label: 'כתובת', 
    type: 'input', 
    placeholder: 'הכנס כתובת מלאה' 
  },
  { 
    key: 'phone', 
    label: 'טלפון', 
    type: 'input', 
    placeholder: 'הכנס מספר טלפון' 
  },
  { 
    key: 'description', 
    label: 'תיאור', 
    type: 'textarea', 
    placeholder: 'תיאור הבריכה', 
    rows: 3 
  },
  { 
    key: 'latitude', 
    label: 'קו רוחב', 
    type: 'input', 
    inputType: 'number', 
    step: 'any', 
    placeholder: 'קו רוחב (אופציונלי)' 
  },
  { 
    key: 'longitude', 
    label: 'קו אורך', 
    type: 'input', 
    inputType: 'number', 
    step: 'any', 
    placeholder: 'קו אורך (אופציונלי)' 
  }
];

// חוקי ולידציה
export const validationRules = {
  name: {
    required: { value: true, message: 'שם הבריכה הוא שדה חובה' },
    minLength: { value: 2, message: 'שם הבריכה חייב להכיל לפחות 2 תווים' }
  },
  city: {
    required: { value: true, message: 'עיר היא שדה חובה' }
  },
  address: {
    required: { value: true, message: 'כתובת היא שדה חובה' }
  },
  phone: {
    pattern: {
      value: /^[0-9\-\+\s\(\)]+$/,
      message: 'מספר טלפון לא תקין'
    }
  }
};

// הגדרות כלליות
export const poolConfig = {
  pageTitle: 'ניהול בריכות',
  description: 'צפייה וניהול בריכות במערכת',
  emptyMessage: 'אין בריכות במערכת',
  addButtonText: 'הוסף בריכה חדשה'
};
