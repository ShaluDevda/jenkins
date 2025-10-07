/**
 * Decodes a Base64-encoded string to its original value.
 * @param {string} encodedString - The Base64-encoded string.
 * @returns {string} - The decoded string.
 */
export function decodeBase64(encodedString) {
    try {
      // Decode the Base64 string
      const decodedString = Buffer.from(encodedString, 'base64').toString('utf-8');
      return decodedString;
    } catch (error) {
      console.error('Error decoding Base64 string:', error);
      throw new Error('Invalid Base64 string');
    }
  }

//   import { decodeBase64 } from '../utils/crypto';

// const encodedPart = 'ZGFzaGJvYXJk'; // Example Base64-encoded string
// const decodedValue = decodeBase64(encodedPart);
// console.log(decodedValue); // Output: "dashboard"