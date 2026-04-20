function decrypt(encryptedText) {
  encryptedText = decodeURIComponent(encryptedText);
  let decrypted = '';
  for (let i = 0; i < encryptedText.length; i++) {
    const key = import.meta.env.VITE_ACHIEVEMENT_KEY || 'compcon';
    const charCode =
      encryptedText.charCodeAt(i) ^
      key.charCodeAt(i % key.length);
    decrypted += String.fromCharCode(charCode);
  }
  return decrypted;
}

function encrypt(text) {
  let encrypted = '';
  for (let i = 0; i < text.length; i++) {
    const key = import.meta.env.VITE_ACHIEVEMENT_KEY || 'compcon';
    const charCode =
      text.charCodeAt(i) ^
      key.charCodeAt(i % key.length);
    encrypted += String.fromCharCode(charCode);
  }
  return encodeURIComponent(encrypted);
}

export { decrypt, encrypt };
