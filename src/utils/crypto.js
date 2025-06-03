const CRYPTO_KEY = 'kqa-secret-key'; // Esta chave deve ser armazenada em variáveis de ambiente em produção

export const encrypt = text => {
  try {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ('0' + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code =>
      textToChars(CRYPTO_KEY).reduce((a, b) => a ^ b, code);

    return text
      .split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    return text;
  }
};

export const decrypt = encoded => {
  try {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code =>
      textToChars(CRYPTO_KEY).reduce((a, b) => a ^ b, code);

    return encoded
      .match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    return encoded;
  }
};
