/**
 * Utility helper functions
 */

/**
 * Validate email address format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string for logging
 */
function sanitizeForLog(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[^\w\s@.-]/g, '');
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toISOString();
  } catch (error) {
    return dateString;
  }
}

/**
 * Deep clone object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Generate unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  isValidEmail,
  sanitizeForLog,
  formatDate,
  deepClone,
  isEmpty,
  generateId
};