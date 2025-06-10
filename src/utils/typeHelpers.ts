
/**
 * Utility functions for type conversions and validations
 */

/**
 * Safely convert a value to number, returning 0 for empty strings or invalid values
 */
export const toNumber = (value: number | string | ''): number => {
  if (typeof value === 'number') return value;
  if (value === '' || value === null || value === undefined) return 0;
  const parsed = parseFloat(value.toString());
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Safely convert a value to string
 */
export const toString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return value.toString();
};

/**
 * Check if value is a valid positive number
 */
export const isValidPositiveNumber = (value: number | string | ''): boolean => {
  const num = toNumber(value);
  return num > 0;
};

/**
 * Format number with specified decimal places
 */
export const formatNumber = (value: number | string | '', decimals = 2): string => {
  const num = toNumber(value);
  return num.toFixed(decimals);
};

/**
 * Convert input value to number or empty string for form fields
 */
export const convertInputValue = (value: string | number): number | '' => {
  if (typeof value === 'number') return value;
  if (value === '' || value === null || value === undefined) return '';
  const parsed = parseFloat(value);
  return isNaN(parsed) ? '' : parsed;
};

/**
 * Validate if a string represents a valid number
 */
export const isNumericString = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
};
