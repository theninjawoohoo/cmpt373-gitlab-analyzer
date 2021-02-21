import { MergeRequestParticipant } from '@ceres/types';
import { MergeRequest as MergeRequestEntity } from '.././merge-request.entity';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { MergeRequestParticipant as MergeRequestParticipantEntity } from './merge-request-participant.entity';

@Injectable()
export class MergeRequestParticipantService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(MergeRequestEntity)
    private readonly mergeRequestRepository: TypeORMRepository<MergeRequestEntity>,
    @InjectRepository(MergeRequestParticipantEntity)
    private readonly participantRepository: TypeORMRepository<MergeRequestParticipantEntity>,
  ) {}

  async syncForMergeRequest(mergeRequest: MergeRequestEntity, token: string) {
    const participants = await this.fetchForMergeRequest(mergeRequest, token);
    return this.createOrUpdate(mergeRequest, participants);
  }

  async findAllForMergeRequest(mergeRequest: MergeRequestEntity) {
    return this.participantRepository.find({
      where: { mergeRequest: mergeRequest },
    });
  }

  async createOrUpdate(
    mergeRequest: MergeRequestEntity,
    participants: MergeRequestParticipant[],
  ) {
    const entities = await Promise.all(
      participants.map(async (participant) => {
        let entity = await this.participantRepository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: participant.id,
            },
          })
          .andWhere('merge_request_id = :mr_Id', {
            mr_Id: mergeRequest.id,
          })
          .getOne();
        if (!entity) {
          entity = this.participantRepository.create({
            mergeRequest: mergeRequest,
            resource: participant,
          });
        } else {
          entity.resource = participant;
        }
        return entity;
      }),
    );
    return this.participantRepository.save(entities);
  }

  private async fetchForMergeRequest(
    mergeRequest: MergeRequestEntity,
    token: string,
  ) {
    const url = `/projects/${mergeRequest.resource.project_id}/merge_requests/${mergeRequest.resource.iid}/participants`;
    const axiosResponse = await this.httpService
      .get<MergeRequestParticipant[]>(url, {
        headers: {
          'PRIVATE-TOKEN': token,
        },
        params: {
          per_page: 50,
        },
      })
      .toPromise();
    return axiosResponse.data;
  }
}
