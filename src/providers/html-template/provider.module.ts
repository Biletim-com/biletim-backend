import { Global, Module } from '@nestjs/common';
import { HtmlTemplateService } from './provider.service';

@Global()
@Module({
  providers: [HtmlTemplateService],
  exports: [HtmlTemplateService],
})
export class HtmlTemplateModule {}
