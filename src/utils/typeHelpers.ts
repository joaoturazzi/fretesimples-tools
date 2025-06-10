
/**
 * Utility functions for type conversion and validation
 */

/**
 * Safely converts a value that can be number or empty string to number
 * @param value - The value to convert
 * @param defaultValue - Default value if conversion fails
 * @returns A valid number
 */
export const toNumber = (value: number | string | '', defaultValue: number = 0): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? defaultValue : value;
  }
  
  if (typeof value === 'string') {
    if (value === '' || value.trim() === '') {
      return defaultValue;
    }
    
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  
  return defaultValue;
};

/**
 * Validates if a value is a valid number (not empty string or NaN)
 * @param value - The value to validate
 * @returns True if the value is a valid number
 */
export const isValidNumber = (value: number | string | ''): boolean => {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  }
  
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = parseFloat(value);
    return !isNaN(parsed) && isFinite(parsed);
  }
  
  return false;
};

/**
 * Formats a number for display, handling edge cases
 * @param value - The value to format
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export const formatNumber = (value: number | string | '', decimals: number = 2): string => {
  const num = toNumber(value);
  return num.toFixed(decimals);
};

/**
 * Type guard to check if a value is a number (not empty string)
 * @param value - The value to check
 * @returns True if value is a number
 */
export const isNumber = (value: number | string | ''): value is number => {
  return typeof value === 'number';
};
