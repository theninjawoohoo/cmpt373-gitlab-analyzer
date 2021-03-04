import { Note } from '@ceres/types';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Repository as TypeORMCommit } from 'typeorm';
import { Repository } from '../repository.entity';
import { Note as NoteEntity } from './notes.entity';

@Injectable()
export class NoteService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(NoteEntity)
    private readonly noteRepository: TypeORMCommit<NoteEntity>,
  ) {}

  async findAllForRepository(repository: Repository) {
    return this.noteRepository.find({
      where: { repository: repository },
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
      await this.syncForRepositoryPage(token, repository, notes);
      page++;
    } while (notes.length > 0);
  }

  async syncForRepositoryPage(
    token: string,
    repository: Repository,
    notes: Note[],
  ): Promise<void> {
    const { created } = await this.createIfNotExists(repository, notes);
    await Promise.all(created.map((note) => ({ ...note, repository })));
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

  private async createIfNotExists(repository: Repository, notes: Note[]) {
    const entities = await Promise.all(
      notes.map(async (note) => {
        const found = await this.noteRepository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: note.id,
            },
          })
          .andWhere('repository_id = :repositoryId', {
            repositoryId: repository.id,
          })
          .getOne();
        if (found) {
          return { note: found, created: false };
        }
        return {
          note: this.noteRepository.create({
            repository: repository,
            resource: note,
          }),
          created: true,
        };
      }),
    );
    return {
      existing: entities
        .filter(({ created }) => !created)
        .map(({ note }) => note),
      created: await this.noteRepository.save(
        entities.filter(({ created }) => created).map(({ note }) => note),
      ),
    };
  }
}
