// Response helper template
// Format: { message: string, data: any }

/**
 * Basic response template
 * @param {string} message - Response message
 * @param {any} data - Response data (array, object, or null)
 * @returns {object} Formatted response
 */
export const basicResponse = (message, data = null) => {
  return {
    message,
    data
  };
};

/**
 * Response for list data (GET all)
 * Returns empty array [] if no data
 * @param {string} message - Response message
 * @param {array} data - Array of items
 * @returns {object} Formatted response
 */
export const listResponse = (message, data = []) => {
  return {
    message,
    data: Array.isArray(data) ? data : []
  };
};

/**
 * Response for single item (GET by ID, CREATE, UPDATE, DELETE)
 * Returns {} if no data
 * @param {string} message - Response message
 * @param {object} data - Single object
 * @returns {object} Formatted response
 */
export const itemResponse = (message, data = null) => {
  return {
    message,
    data: data || {}
  };
};

/**
 * Error response
 * @param {string} message - Error message
 * @param {any} data - Additional error data (optional)
 * @returns {object} Formatted error response
 */
export const errorResponse = (message, data = null) => {
  return {
    message,
    data
  };
};
