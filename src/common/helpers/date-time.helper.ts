import * as dayjs from 'dayjs';

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
}
