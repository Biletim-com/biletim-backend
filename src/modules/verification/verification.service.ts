import { Injectable } from '@nestjs/common';

// repositories
import { VerificationsRepository } from './verification.repository';

// entites
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { Verification } from './verification.entity';

// enums
import { VerificationType } from '@app/common/enums';

// helpers
import { DateTimeHelper } from '@app/common/helpers';

// types
import { UUID } from '@app/common/types';

// errors
import {
  UserNotFoundError,
  VerificaitonCodeExpiredError,
  VerificaitonCodeInvalidError,
  VerificaitonCodeUserError,
} from '@app/common/errors';

@Injectable()
export class VerificationService {
  constructor(private verificationRepository: VerificationsRepository) {}

  async createProfileActivationVerificationCode(user: User): Promise<number> {
    const { verificationCode } = await this.uniqueSixDigitNumber();
    await this.verificationRepository.save(
      new Verification({
        user,
        verificationCode: verificationCode,
        isUsed: false,
        type: VerificationType.ACTIVATE_PROFILE,
        expiredAt: DateTimeHelper.addMinutesToCurrentDateTime(4),
      }),
    );
    return verificationCode;
  }

  async createOrderCancellationVerificationCode(order: Order): Promise<number> {
    const { verificationCode } = await this.uniqueSixDigitNumber();

    await this.verificationRepository.save(
      new Verification({
        order,
        verificationCode: verificationCode,
        isUsed: false,
        type: VerificationType.CANCEL_ORDER,
        expiredAt: DateTimeHelper.addMinutesToCurrentDateTime(4),
      }),
    );
    return verificationCode;
  }

  async findByEmailAndVerificationCode(
    email: string,
    verificationCode: number,
  ) {
    const userVerification = await this.verificationRepository.findOne({
      where: {
        verificationCode: verificationCode,
        type: VerificationType.ACTIVATE_PROFILE,
        user: { email: email },
      },
      relations: { user: true },
    });

    if (!userVerification) throw new VerificaitonCodeInvalidError();

    if (!userVerification.user) throw new UserNotFoundError();

    return userVerification;
  }

  async findByOrderIdAndVerificationCode(
    orderId: UUID,
    verificationCode: number,
  ): Promise<Verification> {
    const orderCancellationVerification =
      await this.verificationRepository.findOne({
        where: {
          verificationCode: verificationCode,
          type: VerificationType.CANCEL_ORDER,
          order: { id: orderId },
        },
        relations: { order: true },
      });

    if (!orderCancellationVerification)
      throw new VerificaitonCodeInvalidError();

    return orderCancellationVerification;
  }

  async verifyVerification(
    verificationIdOrVerificationObject: UUID | Verification,
  ) {
    const { expiredAt, isUsed } =
      await this.verificationRepository.findEntityData(
        verificationIdOrVerificationObject,
      );

    const isCodeExpired = DateTimeHelper.isTimeExpired(expiredAt);
    if (isCodeExpired) {
      throw new VerificaitonCodeExpiredError();
    }
    if (isUsed) {
      throw new VerificaitonCodeUserError();
    }
  }

  async markAsUsed(verificationId: UUID): Promise<void> {
    await this.verificationRepository.update(verificationId, { isUsed: true });
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
