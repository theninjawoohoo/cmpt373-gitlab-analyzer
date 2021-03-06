import { Note } from '@ceres/types';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Repository as TypeORMNote } from 'typeorm';
import { Repository } from '../repository.entity';
import { Note as NoteEntity } from './notes.entity';
import { MergeRequest as MergeRequestEntity } from '../../merge-request/merge-request.entity';

@Injectable()
export class NoteService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(NoteEntity)
    private readonly noteRepository: TypeORMNote<NoteEntity>,
  ) {}

  async findAllForMergeRequest(mergeRequest: MergeRequestEntity) {
    console.log(mergeRequest);
    return this.noteRepository.find({
      where: { mergeRequest: mergeRequest },
    });
  }

  async findOne(id: string) {
    return this.noteRepository.findOne({
      where: { id },
    });
  }

  async syncForMergeRequest(mergeRequest: MergeRequestEntity, token: string) {
    console.log('syncForMergeRequest inside notes service');
    const note = await this.fetchForMergeRequest(mergeRequest, token);
    return this.createOrUpdate(mergeRequest, note);
  }

  async fetchByPage(
    token: string,
    repo: Repository,
    page: number,
  ): Promise<Note[]> {
    const axiosResponse = await this.fetchFromGitlab(token, repo, page);
    return axiosResponse.data;
  }

  private async fetchForMergeRequest(
    mergeRequest: MergeRequestEntity,
    token: string,
  ) {
    const url = `/projects/${mergeRequest.resource.project_id}/merge_requests/${mergeRequest.resource.iid}/notes`;
    const axiosResponse = await this.httpService
      .get<Note[]>(url, {
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

  async findByGitlabId(repository: Repository, id: string) {
    return this.noteRepository
      .createQueryBuilder()
      .where('repository_id = :repositoryId', { repositoryId: repository.id })
      .andWhere('resource @> :resource', { resource: { id } })
      .getOne();
  }

  private async fetchFromGitlab(
    token: string,
    repo: Repository,
    page: number,
    pageSize = 10,
  ): Promise<AxiosResponse<Note[]>> {
    return await this.httpService
      .get<Note[]>(`projects/${repo.resource.id}/repository/notes`, {
        headers: {
          'PRIVATE-TOKEN': token,
        },
        params: {
          per_page: pageSize,
          page,
          ref_name: 'master',
        },
      })
      .toPromise();
  }

  async createOrUpdate(mergeRequest: MergeRequestEntity, notes: Note[]) {
    const entities = await Promise.all(
      notes.map(async (note) => {
        let entity = await this.noteRepository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: note.id,
            },
          })
          .andWhere('merge_request_id = :mr_Id', {
            mr_Id: mergeRequest.id,
          })
          .getOne();
        if (!entity) {
          entity = this.noteRepository.create({
            mergeRequest: mergeRequest,
            resource: note,
          });
        } else {
          entity.resource = note;
        }
        return entity;
      }),
    );
    return this.noteRepository.save(entities);
  }
}
