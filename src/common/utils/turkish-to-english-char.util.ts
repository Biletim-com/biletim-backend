export const turkishToEnglish = (text: string): string => {
  const turkishMap: { [key: string]: string } = {
    Ç: 'C',
    Ğ: 'G',
    İ: 'I',
    Ö: 'O',
    Ş: 'S',
    Ü: 'U',
    ç: 'c',
    ğ: 'g',
    ı: 'i',
    ö: 'o',
    ş: 's',
    ü: 'u',
  };
  return text
    .split('')
    .map((char) => turkishMap[char] || char)
    .join('');
};
