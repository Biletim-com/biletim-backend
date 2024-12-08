import * as dayjs from 'dayjs';
import { DateTime } from '../types';

export class DateTimeHelper {
  static formatTurkishDate(dateString: string): string {
    const date = new Date(dateString);
    const turkishDate = new Intl.DateTimeFormat('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
    return turkishDate.replace(/(\d{4})/, '$1,');
  }

  static extractDate(dateString: string) {
    return dayjs(dateString).format('DD.MM.YYYY');
  }

  static extractTime(dateString: string): string {
    const utcDateTime = `${dateString.split('+')[0]}Z`;
    return dayjs(utcDateTime).format('HH:mm');
  }

  static calculateDuration(
    departureDateTime: string,
    arrivalDateTime: string,
  ): string {
    const departureDate = new Date(departureDateTime);
    const arrivalDate = new Date(arrivalDateTime);
    const diffDate = new Date(arrivalDate.getTime() - departureDate.getTime());
    const hours = diffDate.getHours();
    const minutes = diffDate.getMinutes();
    return `${hours} saat${minutes !== 0 ? ` ${minutes} dakika` : ''}`;
  }

  static addMinutesToCurrentDateTime(minutes: number): DateTime {
    const currentTimestamp = new Date();
    currentTimestamp.setMinutes(currentTimestamp.getMinutes() + minutes);
    return currentTimestamp.toISOString() as DateTime;
  }

  static isTimeExpired(expiredAt: string): boolean {
    const currentDate = new Date();
    const expiryDate = new Date(expiredAt);
    return currentDate.getTime() >= expiryDate.getTime();
  }

  static isPastDate(date: Date | string): boolean {
    const givenDate = new Date(date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    givenDate.setHours(0, 0, 0, 0);

    return givenDate < today;
  }
}
