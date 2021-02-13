import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance } from 'axios';

@Injectable()
export class GitlabApiService extends HttpService {
  constructor(
    axios: AxiosInstance,
    private readonly configService: ConfigService,
  ) {
    super(axios);
    axios.defaults.baseURL = configService.get('gitlabBaseUrl');
  }
}
