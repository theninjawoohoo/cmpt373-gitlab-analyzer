import { HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';

export abstract class Fetch {
  protected constructor(readonly httpService: HttpService) {}
  async fetchWithRetries<T>(
    token: string,
    url: string,
    params: any,
    maxRetries = 5,
  ): Promise<AxiosResponse<T[]>> {
    let data: AxiosResponse<T[]>;
    let attemptsCount = 0;
    while (!data && attemptsCount < maxRetries) {
      try {
        data = await this.httpService
          .get<T[]>(url, {
            headers: {
              'PRIVATE-TOKEN': token,
            },
            params: params,
          })
          .toPromise();
      } catch {}
      attemptsCount++;
    }
    if (!data) {
      throw new Error('Could not fetch resources from GitLab');
    }
    return data;
  }

  async fetchWithRetries_noType(
    token: string,
    url: string,
    params: any,
    maxRetries = 5,
  ): Promise<AxiosResponse> {
    let data: AxiosResponse;
    let attemptsCount = 0;
    while (!data && attemptsCount < maxRetries) {
      try {
        data = await this.httpService
          .get(url, {
            headers: {
              'PRIVATE-TOKEN': token,
            },
            params: params,
          })
          .toPromise();
      } catch {}
      attemptsCount++;
    }
    if (!data) {
      throw new Error('Could not fetch resources from GitLab');
    }
    return data;
  }
}
