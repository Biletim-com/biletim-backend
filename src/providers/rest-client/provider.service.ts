import { HttpException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from '@nestjs/terminus/dist/utils';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';

type Methods = 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH';

interface RequestConfigs {
  url: string;
  method: Methods;
  headers?: Record<string, string>;
  data?: Record<string, string>;
  params?: Record<string, string>;
}

@Injectable()
export class RestClientService {
  private readonly logger = new Logger(RestClientService.name);

  constructor(private readonly httpService: HttpService) {}

  private getErrorMessage(
    error: AxiosError,
    method: Methods,
    url: string,
  ): string {
    return (
      error.response?.data?.error?.message ||
      error.response?.data?.error ||
      error.message ||
      `${method} request failed to ${url}`
    );
  }

  async request<T>(config: RequestConfigs): Promise<T> {
    try {
      const response = await this.httpService.axiosRef.request<T>(config);
      return response.data;
    } catch (error) {
      this.logger.error(error);
      if (isAxiosError(error)) {
        const errorMessage = this.getErrorMessage(
          error,
          config.method,
          config.url,
        );
        const statusCode = Number(error.status || error.response.status);

        throw new HttpException(errorMessage, statusCode);
      }
      throw error;
    }
  }
}
