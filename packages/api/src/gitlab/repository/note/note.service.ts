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
import { AxiosResponse } from 'axios';

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
    return this.saveMergeRequestNote(mergeRequest, note);
  }

  async syncForIssue(issue: IssueEntity, token: string) {
    const note = await this.fetchForIssue(issue, token);
    return this.saveIssueNote(issue, note);
  }

  async fetchForMergeRequest(mergeRequest: MergeRequestEntity, token: string) {
    const url = `/projects/${mergeRequest.resource.project_id}/merge_requests/${mergeRequest.resource.iid}/notes`;
    let axiosResponse: AxiosResponse<Note[]>;
    let attemptsCount = 0;
    while (!axiosResponse && attemptsCount < 5) {
      try {
        axiosResponse = await this.httpService
          .get<Note[]>(url, {
            headers: {
              'PRIVATE-TOKEN': token,
            },
            params: {
              per_page: 50,
            },
          })
          .toPromise();
      } catch {}
      attemptsCount++;
    }
    if (!axiosResponse) {
      throw new Error('Could not fetch merge-request-notes from GitLab');
    }
    return axiosResponse.data;
  }

  async fetchForIssue(issue: IssueEntity, token: string) {
    const url = `/projects/${issue.resource.project_id}/issues/${issue.resource.iid}/notes`;
    let axiosResponse: AxiosResponse<Note[]>;
    let attemptsCount = 0;
    while (!axiosResponse && attemptsCount < 5) {
      try {
        axiosResponse = await this.httpService
          .get<Note[]>(url, {
            headers: {
              'PRIVATE-TOKEN': token,
            },
            params: {
              per_page: 50,
            },
          })
          .toPromise();
      } catch {}
      attemptsCount++;
    }
    if (!axiosResponse) {
      throw new Error('Could not fetch issue-notes from GitLab');
    }
    return axiosResponse.data;
  }

  async saveMergeRequestNote(mergeRequest: MergeRequestEntity, notes: Note[]) {
    const entities = await Promise.all(
      notes.map(async (note) => {
        return this.createOrUpdateMergeRequestNote(mergeRequest, note);
      }),
    );
    return this.noteRepository.save(entities);
  }

  async saveIssueNote(issue: IssueEntity, notes: Note[]) {
    const entities = await Promise.all(
      notes.map(async (note) => {
        return this.createOrUpdateIssueNote(issue, note);
      }),
    );
    return this.noteRepository.save(entities);
  }

  private async createOrUpdateMergeRequestNote(
    mergeRequest: MergeRequestEntity,
    note: Note,
  ) {
    let entity = await this.queryNoteForMergeRequest(mergeRequest, note);
    if (!entity) {
      entity = this.createNoteForMergeRequest(mergeRequest, note);
    } else {
      entity.resource = note;
    }
    return entity;
  }

  private async createOrUpdateIssueNote(issue: IssueEntity, note: Note) {
    let entity = await this.queryNoteForIssue(issue, note);
    if (!entity) {
      entity = this.createNoteForIssue(issue, note);
    } else {
      entity.resource = note;
    }
    return entity;
  }

  private queryNoteForMergeRequest(
    mergeRequest: MergeRequestEntity,
    note: Note,
  ) {
    return this.noteRepository
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
  }

  private queryNoteForIssue(issue: IssueEntity, note: Note) {
    return this.noteRepository
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
  }

  private createNoteForMergeRequest(
    mergeRequest: MergeRequestEntity,
    note: Note,
  ) {
    return this.noteRepository.create({
      mergeRequest: mergeRequest,
      resource: note,
    });
  }

  private createNoteForIssue(issue: IssueEntity, note: Note) {
    return this.noteRepository.create({
      issue: issue,
      resource: note,
    });
  }
}
