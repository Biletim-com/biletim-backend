import { Module } from '@nestjs/common';
import { BiletallService } from './biletall.service';
import { BiletallController } from './biletall.controller';
import { SoapModule } from 'nestjs-soap';

@Module({
  imports: [
    SoapModule.forRoot({
      clientName: 'BiletallClient',
      uri: 'http://94.55.20.137/WSTEST/Service.asmx?wsdl',
      auth: {
        type: 'basic',
        username: 'biletimcomWS',
        password: 'aa8809',
      },
    }),
  ],
  controllers: [BiletallController],
  providers: [BiletallService],
  exports: [SoapModule, BiletallService],
})
export class BiletallModule {}
