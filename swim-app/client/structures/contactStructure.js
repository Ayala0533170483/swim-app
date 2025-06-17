
export const contactFormStructure = {
  defaultValues: {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  },

  formFields: [
    {
      key: 'name',
      label: 'שם מלא',
      type: 'text',
      inputType: 'text',
      placeholder: 'הכנס את שמך המלא',
      required: true,
      gridColumn: 1
    },
    {
      key: 'email',
      label: 'אימייל',
      type: 'text',
      inputType: 'email',
      placeholder: 'your@email.com',
      required: true,
      gridColumn: 2,
    },
    {
      key: 'phone',
      label: 'טלפון',
      type: 'text',
      inputType: 'tel',
      placeholder: '050-1234567',
      required: false,
      gridColumn: 1
    },
    {
      key: 'subject',
      label: 'נושא',
      type: 'select',
      placeholder: 'בחר נושא',
      required: true,
      gridColumn: 2,
      options: [
        { value: '', label: 'בחר נושא' },
        { value: 'registration', label: 'הרשמה לקורסים' },
        { value: 'schedule', label: 'מידע על לוחות זמנים' },
        { value: 'prices', label: 'מחירים ותשלומים' },
        { value: 'facilities', label: 'מתקנים ושירותים' },
        { value: 'complaint', label: 'תלונה' },
        { value: 'other', label: 'אחר' }
      ]
    },
    {
      key: 'message',
      label: 'הודעה',
      type: 'textarea',
      placeholder: 'כתב את הודעתך כאן...',
      required: true,
      rows: 6,
      fullWidth: true
    }
  ],

  validationRules: {
    name: {
      required: 'שם מלא הוא שדה חובה',
      minLength: {
        value: 2,
        message: 'שם חייב להכיל לפחות 2 תווים'
      },
      maxLength: {
        value: 50,
        message: 'שם לא יכול להכיל יותר מ-50 תווים'
      }
    },
    email: {
      required: 'אימייל הוא שדה חובה',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'כתובת אימייל לא תקינה'
      }
    },
    phone: {
      pattern: {
        value: /^[0-9\-\+\(\)\s]+$/,
        message: 'מספר טלפון לא תקין'
      },
      minLength: {
        value: 9,
        message: 'מספר טלפון חייב להכיל לפחות 9 ספרות'
      }
    },
    subject: {
      required: 'נושא הוא שדה חובה'
    },
    message: {
      required: 'הודעה היא שדה חובה',
      minLength: {
        value: 10,
        message: 'הודעה חייבת להכיל לפחות 10 תווים'
      },
      maxLength: {
        value: 1000,
        message: 'הודעה לא יכולה להכיל יותר מ-1000 תווים'
      }
    }
  },

  submitButton: {
    text: 'שלח הודעה',
    loadingText: 'שולח...',
    className: 'contact-submit-btn'
  },

  messages: {
    success: 'ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.',
    error: 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב.',
    validationError: 'אנא מלא את כל השדות הנדרשים'
  },

  settings: {
    resetFormAfterSubmit: true,
    showSuccessAlert: true,
    enableAutoSave: false,
    submitType: 'messages',
    useContactStyle: true
  }
};

export default contactFormStructure;
