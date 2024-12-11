import { HotelApiConfigService } from '@app/configs/hotel-api/config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HotelHelperService {
  constructor(private readonly hotelApiConfigService: HotelApiConfigService) {}

  public getBasicAuthHeader() {
    const { hotelApiUsername, hotelApiPassword } = this.hotelApiConfigService;

    const auth = Buffer.from(
      `${hotelApiUsername}:${hotelApiPassword}`,
    ).toString('base64');

    return {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }

  public toCamelCase(snakeStr: string): string {
    return snakeStr.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  public convertKeysToCamelCase(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.convertKeysToCamelCase(item));
    } else if (data !== null && typeof data === 'object') {
      return Object.keys(data).reduce((acc, key) => {
        const camelCaseKey = this.toCamelCase(key);
        acc[camelCaseKey] = this.convertKeysToCamelCase(data[key]);
        return acc;
      }, {});
    }
    return data;
  }
}
