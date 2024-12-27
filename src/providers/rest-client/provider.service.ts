import { HttpException, Logger } from '@nestjs/common';
import { isAxiosError } from '@nestjs/terminus/dist/utils';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';
import axios, { AxiosInstance } from 'axios';

type Methods = 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH';

interface RequestConfigs {
  method: Methods;
  path?: string;
  headers?: Record<string, string>;
  data?: Record<string, any> | any;
  params?: Record<string, string>;
}

export class RestClientService {
  private readonly axiosInstance: AxiosInstance;
  private readonly logger = new Logger(RestClientService.name);

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({ baseURL });
  }

  private getErrorMessage(
    error: AxiosError,
    method: Methods,
    path?: string,
  ): string {
    return (
      error.response?.data?.error?.message ||
      error.response?.data?.error ||
      error.message ||
      `${method} request failed to ${path}`
    );
  }

  async request<T>(config: RequestConfigs): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        ...config,
        url: config.path,
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = this.getErrorMessage(
          error,
          config.method,
          config.path,
        );
        console.log(error)
        const statusCode = Number(error.status || error.response.status);

        throw new HttpException(errorMessage, statusCode);
      }
      throw error;
    }
  }
}
