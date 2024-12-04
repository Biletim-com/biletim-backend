import { Injectable, NotFoundException } from '@nestjs/common';

//entities&repositories
import { VerificationsRepository } from './verification.repository';
import { Verification } from './verification.entity';
import { User } from '../users/user.entity';
import { DateTimeHelper } from '@app/common/helpers';
import { VerificationType } from '@app/common/enums';


@Injectable()
export class VerificationService {
  constructor(private verificationRepository: VerificationsRepository) {}

  async createVerificationCode(user: User, type: VerificationType): Promise<number> {
    const { verificationCode } = await this.uniqueSixDigitNumber();

    await this.verificationRepository.save(
      new Verification({
        user,
        verificationCode: verificationCode,
        isUsed: false,
        type: type,
        expiredAt: DateTimeHelper.addMinutesToCurrentDateTime(4)
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

    if (!userVerification.user)
      throw new NotFoundException('User Not found');

    return userVerification.user.id;
  }

  async findByEmailAndVerificationCodeAndType(email: string, verificationCode: number, type: VerificationType) {
    const userVerification = await this.verificationRepository.findOne({
      where: { 
        verificationCode: verificationCode,
        type: type,
        user: { email: email }
       },
      relations: { user: true },
    });

    if (!userVerification)
      throw new NotFoundException('Not found userId with verificationCode');

    if (!userVerification.user)
      throw new NotFoundException('User Not found');

    return userVerification;
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
