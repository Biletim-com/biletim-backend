import { Injectable } from '@nestjs/common';

// repositories
import { VerificationsRepository } from './verification.repository';

// entites
import { AbstractOrder } from '../orders/abstract-order.entity';
import { User } from '../users/user.entity';
import { Verification } from './verification.entity';
import { HotelBookingOrder } from '../orders/hotel-booking/entities/hotel-booking-order.entity';
import { BusTicketOrder } from '../orders/bus-ticket/entities/bus-ticket-order.entity';
import { PlaneTicketOrder } from '../orders/plane-ticket/entities/plane-ticket-order.entity';

// enums
import { OrderType, VerificationType } from '@app/common/enums';

// helpers
import { DateTimeHelper } from '@app/common/helpers';

// types
import { UUID } from '@app/common/types';

// errors
import {
  ServiceError,
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

  async createOrderCancellationVerificationCode(
    order: AbstractOrder,
  ): Promise<number> {
    const { verificationCode } = await this.uniqueSixDigitNumber();

    const verification = new Verification({
      verificationCode,
      isUsed: false,
      type: VerificationType.CANCEL_ORDER,
      expiredAt: DateTimeHelper.addMinutesToCurrentDateTime(4),
    });

    if (order.type === OrderType.BUS_TICKET) {
      verification.busTicketOrder = order as BusTicketOrder;
    } else if (order.type === OrderType.PLANE_TICKET) {
      verification.planeTicketOrder = order as PlaneTicketOrder;
    } else if (order.type === OrderType.HOTEL_BOOKING) {
      verification.hotelBookingOrder = order as HotelBookingOrder;
    } else {
      throw new ServiceError('Invalid order type');
    }

    await this.verificationRepository.save(verification);
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
        where: [
          {
            verificationCode,
            type: VerificationType.CANCEL_ORDER,
            busTicketOrder: { id: orderId },
          },
          {
            verificationCode,
            type: VerificationType.CANCEL_ORDER,
            planeTicketOrder: { id: orderId },
          },
          {
            verificationCode,
            type: VerificationType.CANCEL_ORDER,
            hotelBookingOrder: { id: orderId },
          },
        ],
        relations: {
          busTicketOrder: true,
          planeTicketOrder: true,
          hotelBookingOrder: true,
        },
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
