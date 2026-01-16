export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidRFPDescription = (description: string): boolean => {
  return description.trim().length >= 10;
};

export const isValidVendorName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateRFPData = (data: {
  naturalLanguagePrompt: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.naturalLanguagePrompt || !isValidRFPDescription(data.naturalLanguagePrompt)) {
    errors.push('Please provide a detailed RFP description (at least 10 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateVendorData = (data: {
  name: string;
  email: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || !isValidVendorName(data.name)) {
    errors.push('Vendor name must be at least 2 characters long');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};