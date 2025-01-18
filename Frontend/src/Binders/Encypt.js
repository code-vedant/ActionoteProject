import CryptoJS from 'crypto-js';

// Ensure the key length matches AES requirements (e.g., 256-bit key)
const secretKey = CryptoJS.SHA256('ra#n3dact-ionote').toString();

/**
 * Encrypts a text using AES encryption and produces a URL-safe Base64 string.
 * @param {string} text - The plain text to encrypt.
 * @returns {string} The encrypted URL-safe Base64 string.
 */
export function encrypt(text) {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString(); // Standard Base64 string
  const urlSafeEncrypted = encrypted
    .replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_') // Replace '/' with '_'
    .replace(/=+$/, ''); // Remove '=' padding
  return urlSafeEncrypted;
}

/**
 * Decrypts an AES-encrypted URL-safe Base64 string.
 * @param {string} encryptedText - The encrypted URL-safe Base64 string.
 * @returns {string} The decrypted plain text.
 */
export function decrypt(encryptedText) {
  // Convert URL-safe Base64 back to standard Base64
  const standardBase64 = encryptedText
    .replace(/-/g, '+') // Replace '-' with '+'
    .replace(/_/g, '/'); // Replace '_' with '/'
  try {
    const bytes = CryptoJS.AES.decrypt(standardBase64, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error('Decryption failed.');
    return decrypted;
  } catch (error) {
    console.error('Error decrypting text:', error.message);
    return null; // Return null on failure
  }
}
