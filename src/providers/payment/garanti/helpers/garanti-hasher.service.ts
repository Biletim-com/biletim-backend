import { createHash } from 'crypto';

export class GarantiHasherService {
  static generateHashSha256(...values: string[]): string {
    const concatenatedValue = values.join('');
    return createHash('sha256')
      .update(concatenatedValue)
      .digest('hex')
      .toUpperCase();
  }
}
