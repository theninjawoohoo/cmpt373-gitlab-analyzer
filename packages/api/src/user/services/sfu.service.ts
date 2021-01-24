import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { parse as parseXml } from 'fast-xml-parser';

@Injectable()
export class SfuService {
  constructor(private readonly configService: ConfigService) {}
  async getUserIdForTicket(ticket: string) {
    const response = await this.authorizeWithSfu(ticket);
    return SfuService.findUserId(response.data);
  }
  private async authorizeWithSfu(ticket: string): Promise<AxiosResponse> {
    const service = this.configService.get<string>('sfuAuthFrontEndService');
    const sfuValidationEndpoint = this.configService.get<string>(
      'sfuValidationEndpoint',
    );
    return axios.get(sfuValidationEndpoint, { params: { ticket, service } });
  }
  private static findUserId(xmlResponse: string) {
    const parsedResponse = parseXml(xmlResponse);
    const userId =
      parsedResponse?.['cas:serviceResponse']?.['cas:authenticationSuccess']?.[
        'cas:userId'
      ];
    if (!userId) {
      throw new Error('Could not authenticate SFU userId');
    }
    return { sfuUserId: userId };
  }
}
