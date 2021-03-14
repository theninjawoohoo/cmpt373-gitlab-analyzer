import { Note } from '@ceres/types';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMNote } from 'typeorm';
import { Note as NoteEntity } from './note.entity';
import { MergeRequest as MergeRequestEntity } from '../../merge-request/merge-request.entity';
import { Issue as IssueEntity } from '../issue/issue.entity';
import { paginate, withDefaults } from '../../../common/query-dto';
import alwaysArray from '../../../common/alwaysArray';
import { NoteQueryDto } from './note-query.dto';

@Injectable()
export class NoteService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(NoteEntity)
    private readonly noteRepository: TypeORMNote<NoteEntity>,
  ) {}

  async search(filters: NoteQueryDto) {
    filters = withDefaults(filters);
    const query = this.noteRepository.createQueryBuilder('note');

    if (filters.merge_request) {
      query.where('merge_request.id = :merge_request', {
        merge_request: filters.merge_request,
      });
    }

    if (filters.issue) {
      query.andWhere('issue.id = :issue', {
        issue: filters.issue,
      });
    }

    if (filters.author_email) {
      query.andWhere("note.resource #>> '{author_email}' IN (:...author)", {
        author_email: alwaysArray(filters.author_email),
      });
    }

    query.orderBy("note.resource #>> '{authored_date}'", 'DESC');
    paginate(query, filters);
    return query.getManyAndCount();
  }

  async findOne(id: string) {
    return this.noteRepository.findOne({
      where: { id },
    });
  }

  async findAllForMergeRequest(mergeRequest: MergeRequestEntity) {
    return this.noteRepository.find({
      where: { mergeRequest: mergeRequest },
    });
  }

  async syncForMergeRequest(mergeRequest: MergeRequestEntity, token: string) {
    const note = await this.fetchForMergeRequest(mergeRequest, token);
    return this.createOrUpdateMergeRequest(mergeRequest, note);
  }

  async syncForIssue(issue: IssueEntity, token: string) {
    const note = await this.fetchForIssue(issue, token);
    return this.createOrUpdateIssue(issue, note);
  }

  async fetchForMergeRequest(mergeRequest: MergeRequestEntity, token: string) {
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

  async fetchForIssue(issue: IssueEntity, token: string) {
    const url = `/projects/${issue.resource.project_id}/issues/${issue.resource.iid}/notes`;
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

  async createOrUpdateMergeRequest(
    mergeRequest: MergeRequestEntity,
    notes: Note[],
  ) {
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

  async createOrUpdateIssue(issue: IssueEntity, notes: Note[]) {
    const entities = await Promise.all(
      notes.map(async (note) => {
        let entity = await this.noteRepository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: note.id,
            },
          })
          .andWhere('issue_id = :is_Id', {
            is_Id: issue.id,
          })
          .getOne();
        if (!entity) {
          entity = this.noteRepository.create({
            issue: issue,
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
