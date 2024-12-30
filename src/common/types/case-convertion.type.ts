export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

export type DeepConvertKeysToCamel<T> = T extends Array<infer U>
  ? DeepConvertKeysToCamel<U>[]
  : T extends object
  ? {
      [K in keyof T as SnakeToCamel<string & K>]: DeepConvertKeysToCamel<T[K]>;
    }
  : T;
