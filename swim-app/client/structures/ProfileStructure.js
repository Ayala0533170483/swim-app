export const profileFields = [
    {
        key: 'name',
        label: 'שם',
        type: 'input',
        inputType: 'text',
        placeholder: 'הכנס שם מלא'
    },
    {
        key: 'email',
        label: 'אימייל',
        type: 'input',
        inputType: 'email',
        placeholder: 'הכנס כתובת אימייל'
    }
];

export const profileValidationRules = {
    name: {
        required: { message: 'שם הוא שדה חובה' },
        minLength: { value: 2, message: 'שם חייב להכיל לפחות 2 תווים' }
    },
    email: {
        required: { message: 'אימייל הוא שדה חובה' },
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'כתובת אימייל לא תקינה'
        }
    }
};
