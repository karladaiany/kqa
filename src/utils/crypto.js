const CRYPTO_KEY = 'qa-tools-secret-key';

export const encryptData = (text) => {
  if (!text) return '';
  try {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(CRYPTO_KEY).reduce((a,b) => a ^ b, code);

    return text
      .split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  } catch (e) {
    console.error('Erro ao criptografar:', e);
    return text;
  }
};

export const decryptData = (encoded) => {
  if (!encoded) return '';
  try {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(CRYPTO_KEY).reduce((a,b) => a ^ b, code);
    
    return encoded
      .match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
  } catch (e) {
    console.error('Erro ao descriptografar:', e);
    return encoded;
  }
}; 