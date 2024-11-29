import { Injectable } from '@nestjs/common';
import { NetGsmConfigService } from '@app/configs/netgsm';
import { RestClientService } from '@app/providers/rest-client/provider.service';

@Injectable()
export class NetGsmProviderService {
  constructor(
    private readonly netGsmConfigService: NetGsmConfigService,
    private readonly restClientService: RestClientService,
  ) {}

  sendSMS(messsage: string, gsmno: string): any {
    const formData = new URLSearchParams();
    formData.append('usercode', this.netGsmConfigService.netGsmUsername);
    formData.append('password', this.netGsmConfigService.netGsmPassword);
    formData.append('gsmno', gsmno);
    formData.append('message', messsage);
    formData.append('msgheader', 'Biletim.com');
    formData.append('filter', '0');
    // formData.append('startdate', dayjs(Date.now()).format("ddMMyyyyHHmm"));
    // formData.append('stopdate', '');
    // formData.append('appkey', this.netGsmConfigService.netGsmAppKey);
    return this.restClientService.request({
      method: 'POST',
      path: '/sms/send/get',
      headers: {
        Accept: '*/*',
      },
      data: formData,
    });
  }
}
