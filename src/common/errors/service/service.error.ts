export class ServiceError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends ServiceError {
  constructor(entity: string) {
    super(`${entity} is not found!`);
  }
}

export class ForbiddenResourceError extends ServiceError {
  constructor(entity: string, source: string) {
    super(`${entity} is forbidden to access ${source}`);
  }
}
