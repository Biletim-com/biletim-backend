import {
  DeepConvertKeysToCamel,
  SnakeToCamel,
} from '../types/case-convertion.type';

export class CaseConversionService {
  private static toCamelCase<S extends string>(snakeStr: S): SnakeToCamel<S> {
    return snakeStr.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    ) as SnakeToCamel<S>;
  }

  public static convertKeysToCamelCase<T>(data: T): DeepConvertKeysToCamel<T> {
    if (Array.isArray(data)) {
      return data.map((item) =>
        this.convertKeysToCamelCase(item),
      ) as DeepConvertKeysToCamel<T>;
    } else if (data !== null && typeof data === 'object') {
      return Object.keys(data).reduce((acc, key) => {
        const camelCaseKey = this.toCamelCase(key);
        (acc as any)[camelCaseKey] = this.convertKeysToCamelCase(
          (data as any)[key],
        );
        return acc;
      }, {} as any) as DeepConvertKeysToCamel<T>;
    }
    return data as DeepConvertKeysToCamel<T>;
  }
}
