import { Inject } from '@nestjs/common';

export const POX_CLIENT_PREFIX = 'POX_CLIENT_';

/**
 * Custom decorator to inject a POX client by name.
 * @param {string} token - The token name to identify the POX client.
 */
export function InjectPoxClient(token: string) {
  const prefixedToken = `${POX_CLIENT_PREFIX}${token}`;
  return Inject(prefixedToken);
}
