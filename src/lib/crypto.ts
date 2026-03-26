import CryptoJS from 'crypto-js';

const SALT = 'SepoliaWalletSalt_crazy123';

/**
 * Encrypts a private key using AES with a user-provided PIN.
 */
export const encryptPrivateKey = (privateKey: string, pin: string): string => {
  const saltedPin = pin + SALT;
  return CryptoJS.AES.encrypt(privateKey, saltedPin).toString();
};

/**
 * Decrypts a private key using AES with a user-provided PIN.
 */
export const decryptPrivateKey = (encryptedKey: string, pin: string): string | null => {
  try {
    const saltedPin = pin + SALT;
    const bytes = CryptoJS.AES.decrypt(encryptedKey, saltedPin);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (e) {
    return null; // Invalid PIN or corrupted data
  }
};

/**
 * Hashes a PIN to check for validity without storing the PIN itself.
 */
export const hashPin = (pin: string): string => {
  return CryptoJS.SHA256(pin + SALT).toString();
};
