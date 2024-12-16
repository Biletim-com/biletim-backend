import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const API_KEY = '';
const payload = {
  data: {
    partner_order_id: 1000,
    status: 'completed',
  },
};
const token = uuidv4();
const timestamp = Math.floor(Date.now() / 1000);

function generateSignature(
  token: string,
  timestamp: number,
  apiKey: string,
): string {
  const dataToSign = `${timestamp}${token}`;
  return crypto.createHmac('sha256', apiKey).update(dataToSign).digest('hex');
}
const signature = generateSignature(token, timestamp, API_KEY);

const webhookBody = {
  ...payload,
  signature: {
    signature: signature,
    timestamp: timestamp,
    token: token,
  },
};

console.log('Simulated Webhook Body:', JSON.stringify(webhookBody, null, 2));
