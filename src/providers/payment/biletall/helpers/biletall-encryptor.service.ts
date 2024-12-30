export class BiletAllEncryptorService {
  private static chars: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    'a',
    'b',
    'c',
    'ç',
    'd',
    'e',
    'f',
    'g',
    'ğ',
    'h',
    'ı',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'ö',
    'p',
    'q',
    'r',
    's',
    'ş',
    't',
    'u',
    'ü',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'Ç',
    'D',
    'E',
    'F',
    'G',
    'Ğ',
    'H',
    'I',
    'İ',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'Ö',
    'P',
    'Q',
    'R',
    'S',
    'Ş',
    'T',
    'U',
    'Ü',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '!',
    "'",
    '^',
    '+',
    '%',
    '&',
    '/',
    '(',
    ')',
    '=',
    '?',
    '_',
    '£',
    '#',
    '$',
    '½',
    '{',
    '[',
    ']',
    '}',
    '\\',
    '|',
    '*',
    '-',
    '~',
    '`',
    ',',
    ';',
    '.',
    ':',
    '<',
    '>',
    '|',
    '@',
    '"',
    'é',
    '€',
    'i',
    '¨',
    'æ',
    'ß',
    ' ',
  ];

  public static encode(str: string): string {
    const constant: number = Math.floor(Math.random() * (870 - 100 + 1)) + 100;
    let result: string = '';

    try {
      for (let i = 0; i < str.length; i++) {
        const index: number = BiletAllEncryptorService.chars.indexOf(str[i]);
        if (index === -1) throw new Error();
        result += (constant + index).toString().padStart(3, '0');
      }
      result += constant.toString();
    } catch {
      return '@HatalıKarakterDizisi';
    }

    return result;
  }

  public static decode(str: string): string {
    const constant: number = parseInt(str.slice(-3));
    let result: string = '';

    try {
      for (let i = 0; i < str.length - 3; i += 3) {
        const index: number = parseInt(str.substr(i, 3)) - constant;
        if (index < 0 || index >= BiletAllEncryptorService.chars.length)
          throw new Error();
        result += BiletAllEncryptorService.chars[index];
      }
    } catch {
      return '@HatalıKarakterDizisi';
    }

    return result;
  }
}
