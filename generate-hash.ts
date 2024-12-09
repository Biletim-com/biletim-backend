import * as crypto from 'crypto';

const requestId = '1a6ec1e2-155e-45f6-b605-cd8b12144840';
const swtId = 'CC82C381E078482AB328943FCCB7100C';
const userId = '3c6186a56354430491baef87cdc3a4fe';
const timestamp = new Date(Date.now()).toISOString();
const swtPassword = '123asdASD@';

const concatenatedValue = `${requestId}${swtId}${userId}${timestamp}${swtPassword}`;
const hashedValue = crypto
  .createHash('sha256')
  .update(concatenatedValue)
  .digest('hex')
  .toUpperCase();

console.log({ hashedValue, timestamp });
