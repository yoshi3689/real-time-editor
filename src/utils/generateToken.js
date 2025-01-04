import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token.
 * @param {Object} payload - The data to be included in the token (e.g., user ID, email).
 * @param {Object} options - Additional options for token generation (e.g., expiresIn).
 * @returns {string} - The signed JWT token.
 */
export const generateToken = (payload, options = { expiresIn: '1h' }) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a valid object.');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret key is not defined in environment variables.');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};
