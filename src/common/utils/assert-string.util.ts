export const assertString = (input: any): void => {
  const isString = typeof input === 'string' || input instanceof String;

  if (!isString) {
    let invalidType: string = typeof input;
    if (input === null) {
      invalidType = 'null';
    } else if (invalidType === 'object' && input.constructor) {
      invalidType = input.constructor.name;
    }

    throw new TypeError(`Expected a string but received a ${invalidType}`);
  }
};
