/**
 * Utilitários de criptografia para dados sensíveis
 */

import CryptoJS from 'crypto-js';

// Chave secreta para criptografia (em produção, deve vir de variável de ambiente)
const SECRET_KEY = 'kqa-secret-key-2024';

/**
 * Criptografa um texto usando AES
 * @param {string} text - Texto a ser criptografado
 * @returns {string} Texto criptografado
 */
export const encrypt = text => {
  try {
    if (!text) return '';

    const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro ao criptografar:', error);
    }
    return text; // Retorna o texto original em caso de erro
  }
};

/**
 * Descriptografa um texto usando AES
 * @param {string} encryptedText - Texto criptografado
 * @returns {string} Texto descriptografado
 */
export const decrypt = encryptedText => {
  try {
    if (!encryptedText) return '';

    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return decrypted;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro ao descriptografar:', error);
    }
    return encryptedText; // Retorna o texto original em caso de erro
  }
};
