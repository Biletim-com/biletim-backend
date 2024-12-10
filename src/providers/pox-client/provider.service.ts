import { HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Builder, parseStringPromise } from 'xml2js';

// utils
import { isObject } from '@app/common/validators';

type Methods = 'POST' | 'GET';

interface RequestConfigs {
  method: Methods;
  path?: string;
  body?: object;
  params?: object;
  headers?: object;
}

export class PoxClientService {
  private readonly axiosInstance: AxiosInstance;
  private readonly logger = new Logger(PoxClientService.name);

  constructor(
    @Inject('POX_BASE_URL')
    baseURL: string,
  ) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Accept: 'application/xml',
      },
    });
  }

  private jsonToXml(json: object): string {
    const builder = new Builder({ headless: true });
    return builder.buildObject(json);
  }

  private async xmlToJson(xml: string): Promise<any> {
    return parseStringPromise(xml, { explicitArray: false });
  }

  async request<T>({
    method,
    path,
    body,
    params,
    headers,
  }: RequestConfigs): Promise<T> {
    const xmlBody = body
      ? Object.keys(body).reduce((acc, key) => {
          if (isObject(body[key])) {
            acc[key] = this.jsonToXml(body[key]);
          }
          return acc;
        }, body)
      : undefined;

    const xmlParams = params
      ? Object.keys(params).reduce((acc, key) => {
          if (isObject(params[key])) {
            params[key] = this.jsonToXml(params[key]);
          }
          return acc;
        }, params)
      : undefined;

    try {
      const { data } = await this.axiosInstance.request({
        method,
        url: path,
        headers,
        params: xmlParams,
        data: xmlBody,
      });
      return this.xmlToJson(data) as T;
    } catch (error) {
      throw new HttpException(
        `POX request failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
