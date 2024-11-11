import { registerAs } from '@nestjs/config';

import { TTamamliyoApiConfiguration } from './config.types';
import ConfigurationNamespaces from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.TAMAMLIYO_API,
  (): TTamamliyoApiConfiguration => ({
    tamamliyoApiBaseUrl: process.env.TAMAMLIYO_API_BASE_URL!,
    tamamliyoApiToken: process.env.TAMAMLIYO_TOKEN!,
  }),
);
