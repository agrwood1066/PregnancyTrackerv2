// Data validation utilities

// Validate shopping item
export const validateShoppingItem = (item: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
    errors.push('Item name is required and must be a non-empty string');
  }
  
  if (item.name && item.name.length > 100) {
    errors.push('Item name must be less than 100 characters');
  }
  
  if (item.price !== undefined && (typeof item.price !== 'number' || item.price < 0)) {
    errors.push('Price must be a non-negative number');
  }
  
  if (item.priceSource && typeof item.priceSource !== 'string') {
    errors.push('Price source must be a string');
  }
  
  if (item.notes && typeof item.notes !== 'string') {
    errors.push('Notes must be a string');
  }
  
  if (item.notes && item.notes.length > 500) {
    errors.push('Notes must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate appointment
export const validateAppointment = (appointment: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!appointment.title || typeof appointment.title !== 'string' || appointment.title.trim() === '') {
    errors.push('Appointment title is required and must be a non-empty string');
  }
  
  if (appointment.title && appointment.title.length > 100) {
    errors.push('Appointment title must be less than 100 characters');
  }
  
  if (!appointment.appointment_date) {
    errors.push('Appointment date is required');
  } else {
    const date = new Date(appointment.appointment_date);
    if (isNaN(date.getTime())) {
      errors.push('Appointment date must be a valid date');
    }
  }
  
  if (appointment.status && !['scheduled', 'completed', 'cancelled'].includes(appointment.status)) {
    errors.push('Appointment status must be one of: scheduled, completed, cancelled');
  }
  
  if (appointment.location && typeof appointment.location !== 'string') {
    errors.push('Location must be a string');
  }
  
  if (appointment.notes && typeof appointment.notes !== 'string') {
    errors.push('Notes must be a string');
  }
  
  if (appointment.notes && appointment.notes.length > 500) {
    errors.push('Notes must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate baby name
export const validateBabyName = (babyName: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!babyName.name || typeof babyName.name !== 'string' || babyName.name.trim() === '') {
    errors.push('Baby name is required and must be a non-empty string');
  }
  
  if (babyName.name && babyName.name.length > 50) {
    errors.push('Baby name must be less than 50 characters');
  }
  
  if (babyName.gender && !['male', 'female', 'neutral'].includes(babyName.gender)) {
    errors.push('Gender must be one of: male, female, neutral');
  }
  
  if (babyName.meaning && typeof babyName.meaning !== 'string') {
    errors.push('Meaning must be a string');
  }
  
  if (babyName.origin && typeof babyName.origin !== 'string') {
    errors.push('Origin must be a string');
  }
  
  if (babyName.status && !['liked', 'disliked', 'maybe'].includes(babyName.status)) {
    errors.push('Status must be one of: liked, disliked, maybe');
  }
  
  if (babyName.notes && typeof babyName.notes !== 'string') {
    errors.push('Notes must be a string');
  }
  
  if (babyName.notes && babyName.notes.length > 500) {
    errors.push('Notes must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate hospital bag item
export const validateHospitalBagItem = (item: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
    errors.push('Item name is required and must be a non-empty string');
  }
  
  if (item.name && item.name.length > 100) {
    errors.push('Item name must be less than 100 characters');
  }
  
  if (item.category && typeof item.category !== 'string') {
    errors.push('Category must be a string');
  }
  
  if (item.status && !['packed', 'not_packed', 'not_needed'].includes(item.status)) {
    errors.push('Status must be one of: packed, not_packed, not_needed');
  }
  
  if (item.notes && typeof item.notes !== 'string') {
    errors.push('Notes must be a string');
  }
  
  if (item.notes && item.notes.length > 500) {
    errors.push('Notes must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 