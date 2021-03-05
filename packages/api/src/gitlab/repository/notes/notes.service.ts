import { Note } from '@ceres/types';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Repository as TypeORMNote } from 'typeorm';
import { Repository } from '../repository.entity';
import { Note as NoteEntity } from './notes.entity';
import { MergeRequest } from '../../merge-request/merge-request.entity';

@Injectable()
export class NoteService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(NoteEntity)
    private readonly noteRepository: TypeORMNote<NoteEntity>,
  ) {}

  async findAllForMergeRequest(mergeRequest: MergeRequest) {
    return this.noteRepository.find({
      where: { mergeRequest: mergeRequest },
    });
  }

  async findOne(id: string) {
    return this.noteRepository.findOne({
      where: { id },
    });
  }

  async fetchForRepository(repository: Repository, token: string) {
    let notes: Note[] = [];
    let page = 1;
    do {
      notes = await this.fetchByPage(token, repository, page);
      page++;
    } while (notes.length > 0);
  }

  async fetchByPage(
    token: string,
    repo: Repository,
    page: number,
  ): Promise<Note[]> {
    const axiosResponse = await this.fetchFromGitlab(token, repo, page);
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
}
