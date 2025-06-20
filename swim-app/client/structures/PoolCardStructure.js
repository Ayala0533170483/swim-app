export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `http://localhost:3000/${imagePath}`;
};

export const getDefaultPoolImage = () => {
  return null;
};

export const updateKeys = [
  { key: 'name', label: 'שם הבריכה', type: 'input' },
  { key: 'city', label: 'עיר', type: 'input' },
  { key: 'phone', label: 'טלפון', type: 'input' },
  { key: 'description', label: 'תיאור', type: 'textarea' },
  { key: 'latitude', label: 'קו רוחב', type: 'input' },
  { key: 'longitude', label: 'קו אורך', type: 'input' },
  {
    key: 'image',
    label: 'תמונה',
    type: 'file',
    accept: 'image/*',
    note: 'קבצי JPG, PNG עד 5MB (אופציונלי בעדכון)'
  }
];

export const addKeys = [
  {
    key: 'name',
    label: 'שם הבריכה',
    type: 'input',
    placeholder: 'הכנס שם בריכה',
    required: true
  },
  {
    key: 'city',
    label: 'עיר',
    type: 'input',
    placeholder: 'הכנס עיר',
    required: true
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
  },
  {
    key: 'image',
    label: 'תמונה',
    type: 'file',
    accept: 'image/*',
    required: true,
    note: 'קבצי JPG, PNG עד 5MB'
  }
];

export const validationRules = {
  name: {
    required: { value: true, message: 'שם הבריכה הוא שדה חובה' },
    minLength: { value: 2, message: 'שם הבריכה חייב להכיל לפחות 2 תווים' }
  },
  city: {
    required: { value: true, message: 'עיר היא שדה חובה' }
  },
  phone: {
    pattern: {
      value: /^[0-9\-\+\s\(\)]+$/,
      message: 'מספר טלפון לא תקין'
    }
  },
  image: {
    required: { value: true, message: 'תמונה נדרשת' },
    validate: (files) => {
      if (!files || files.length === 0) {
        return 'תמונה נדרשת';
      }

      const file = files[0];
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return 'גודל התמונה חייב להיות עד 5MB';
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        return 'רק קבצי JPG, JPEG, PNG מותרים';
      }

      return true;
    }
  }
};

export const poolConfig = {
  pageTitle: 'ניהול בריכות',
  description: 'צפייה וניהול בריכות במערכת',
  emptyMessage: 'אין בריכות במערכת',
  addButtonText: 'הוסף בריכה חדשה'
};

export const formatPoolDisplay = (pool) => {
  return {
    id: pool.pool_id || pool.id,
    title: pool.name,
    subtitle: pool.city,
    description: pool.description,
    phone: pool.phone,
    coordinates: pool.latitude && pool.longitude ? {
      lat: parseFloat(pool.latitude),
      lng: parseFloat(pool.longitude)
    } : null,
    imageUrl: pool.image_path ? getImageUrl(pool.image_path) : null,
    isActive: pool.is_active
  };
};
