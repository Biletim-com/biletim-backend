import { Injectable } from '@nestjs/common';
import { compare, hashSync } from 'bcryptjs';

@Injectable()
export class PasswordService {
  get bcryptSaltRounds(): string | number {
    const saltOrRounds = process.env.BCRYPT_SALT_ROUNDS || 12;

    return Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : saltOrRounds;
  }

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hashPassword(password: string): string {
    return hashSync(password, this.bcryptSaltRounds);
  }
}
