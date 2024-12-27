import { Injectable } from '@nestjs/common';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { MaileonConfigService } from '@app/configs/maileon';
import { Contact } from '@app/common/types/maileon.type';
import axios from 'axios';

@Injectable()
export class MaileonProviderService {
  constructor(
    private readonly maileonConfigService: MaileonConfigService,
    private readonly restClientService: RestClientService,
  ) { }

  private getHeaders() {
    return {
      'Authorization': `Basic ${this.maileonConfigService.maileonApiKey}`,
      'Content-Type': 'application/vnd.maileon.api+xml; charset=utf-8',
    };
  }

  async getContacts() {
    const response = await this.restClientService.request({
      method: 'GET',
      path: '/contacts?page_index=5&page_size=10',
      headers: this.getHeaders(),
    });
    return response;
  }

  async createContact(contact: Contact) {

    const xmlData = `
      <contact>
        <email>${contact.email}</email>
        <standard_fields>
          <field>
            <name>LASTNAME</name>
            <value>${contact.attributes?.lastname}</value>
          </field>
          <field>
            <name>FIRSTNAME</name>
            <value>${contact.attributes?.firstname}</value>
          </field>
        </standard_fields>
      </contact>
    `;
    console.log(contact)
    const response = await this.restClientService.request({
      method: 'POST',
      path: '/mailings?name=selver.said01@gmail.com&subject=my+subject',
      headers: this.getHeaders(),
      // data: xmlData
    });
    // const response = await this.restClientService.request({
    //   method: 'POST',
    //   path: '/contacts/email/selver.said01@gmail.com?permission=5',
    //   headers: this.getHeaders(),
    //   data: xmlData
    // });
    // console.log(response)
    // const url = this.maileonConfigService.maileonBaseURL+"/contacts/email/selver.said01@gmail.com?permission=5"
    // console.log(url)
    // await axios.post(url, xmlData, {
    //   headers: this.getHeaders()
    // }).catch((e) => {
    //   console.log(e);
    // });
    // console.log("response.data ", response.data)
    return response;
  }

  async sendEmail(
    // recipientEmail: string,
    // subject: string,
    // content: string,
    // senderEmail: string,
    // senderName: string,
  ) {


    const response = await this.restClientService.request({
      method: 'POST',
      path: '/transactions/send',
      headers: this.getHeaders(),
      data: {
        recipient: {
          email: "selver.said01@gmail.com",
        },
        sender: {
          email: "satis@golife.com.tr",
          name: "Biletim.com",
        },
        subject: "subject",
        content: "content",
      }
    });
    return response;
  }
}
