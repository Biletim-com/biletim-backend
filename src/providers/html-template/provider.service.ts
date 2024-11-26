import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

// helpers
import { HandlerbarsHelper } from '@app/common/helpers';

@Injectable()
export class HtmlTemplateService {
  constructor() {
    for (const [name, fn] of Object.entries(HandlerbarsHelper.helpers)) {
      Handlebars.registerHelper(name, fn);
    }
  }

  async renderTemplate(templateName: string, data: any): Promise<string> {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.hbs`,
    );
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateContent);
    return template(data);
  }
}
