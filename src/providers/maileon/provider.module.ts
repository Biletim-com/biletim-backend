import { Module, Global } from '@nestjs/common';
import { MaileonProviderService } from './provider.service';
import { MaileonConfigService } from '@app/configs/maileon';
import { RestClientService } from '../rest-client/provider.service';

@Global()
@Module({
  providers: [
    MaileonConfigService,
    {
      provide: RestClientService,
      useFactory: (configService: MaileonConfigService) => {
        const baseUrl = configService.maileonBaseURL;
        return new RestClientService(baseUrl);
      },
      inject: [MaileonConfigService],
    },
    MaileonProviderService,
  ],
  exports: [MaileonProviderService],
})
export class MaileonProviderModule {}