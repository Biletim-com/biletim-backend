import { Injectable, NotFoundException } from '@nestjs/common';

//entities&repositories
import { VerificationsRepository } from './verification.repository';
import { Verification } from './verification.entity';
import { User } from '../user.entity';

@Injectable()
export class VerificationService {
  constructor(private verificationRepository: VerificationsRepository) {}

  async createVerificationCode(user: User): Promise<number> {
    const { verificationCode } = await this.uniqueSixDigitNumber();

    await this.verificationRepository.save(
      new Verification({
        user,
        verificationCode: verificationCode,
        isExpired: false,
        isUsed: false,
      }),
    );

    return verificationCode;
  }

  async findUserIdByVerificationCode(verificationCode: number) {
    const userVerification = await this.verificationRepository.findOne({
      where: { verificationCode: verificationCode },
      relations: { user: true },
    });

    if (!userVerification)
      throw new NotFoundException('Not found userId with verificationCode');

    return userVerification.user.id;
  }

  async uniqueSixDigitNumber() {
    let verificationCode: number;

    do {
      verificationCode = Math.floor(100000 + Math.random() * 900000);

      // expireTime = Date.now() + expirationTime * 60 * 1000;
    } while (verificationCode.toString().length !== 6);

    return { verificationCode };
  }
}
