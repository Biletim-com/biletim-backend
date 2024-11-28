import { lookup } from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(lookup);

export const getContainerIp = async (containerName: string) => {
  try {
    const { address } = await dnsLookup(containerName);
    return address;
  } catch (error) {
    console.error(error);
  }
};
