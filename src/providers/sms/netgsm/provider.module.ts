import { Module, Global } from '@nestjs/common';
import { NetGsmProviderService } from './provider.service';
import { NetGsmConfigService } from '@app/configs/netgsm';
import { RestClientService } from '@app/providers/rest-client/provider.service';

@Global()
@Module({
  providers: [
    NetGsmConfigService,
    {
      provide: RestClientService,
      useFactory: (configService: NetGsmConfigService) => {
        const baseUrl = configService.netGsmBaseURL;
        return new RestClientService(baseUrl);
      },
      inject: [NetGsmConfigService],
    },
    NetGsmProviderService,
  ],
  exports: [NetGsmProviderService],
})
export class NetGsmModule {}
