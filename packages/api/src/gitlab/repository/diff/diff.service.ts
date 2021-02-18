import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MergeRequest } from '../../merge-request/merge-request.entity';
import { Commit } from '../commit/commit.entity';
import { Diff as DiffEntity } from './diff.entity';
import { DeepPartial, Repository as TypeORMRepository } from 'typeorm';
import { Diff } from '@ceres/types';
import { parsePatch } from 'diff';

type GitlabDiff = Omit<Diff, 'hunks'>;

@Injectable()
export class DiffService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(DiffEntity)
    private readonly diffRepository: TypeORMRepository<DiffEntity>,
  ) {}

  async syncForCommit(commit: Commit, token: string) {
    let diffs: GitlabDiff[] = [];
    let page = 1;
    await this.diffRepository.delete({ commit: commit });
    do {
      diffs = await this.fetchPageForCommit(commit, token, page);
      await this.createAll({ commit }, diffs.map(this.addParsedDefinitions));
      page++;
    } while (diffs.length > 0);
  }

  async syncForMergeRequest(mergeRequest: MergeRequest, token: string) {
    const diffs = await this.fetchForMergeRequest(mergeRequest, token);
    await this.createAll(
      { mergeRequest },
      diffs.map(this.addParsedDefinitions),
    );
  }

  private async createAll(
    commonFields: DeepPartial<DiffEntity>,
    diffs: Diff[],
  ) {
    const entities = diffs.map((resource) =>
      this.diffRepository.create({
        ...commonFields,
        resource,
      }),
    );
    return this.diffRepository.save(entities);
  }

  private addParsedDefinitions(diff: GitlabDiff): Diff {
    return {
      ...diff,
      hunks: parsePatch(diff.diff)[0].hunks,
    };
  }

  private async fetchForMergeRequest(
    mergeRequest: MergeRequest,
    token: string,
  ) {
    const url = `/projects/${mergeRequest.repository.resource.id}/merge_requests/${mergeRequest.resource.iid}/changes`;
    const axiosResponse = await this.httpService
      .get(url, {
        headers: {
          'PRIVATE-TOKEN': token,
        },
      })
      .toPromise();
    return axiosResponse.data.changes as GitlabDiff[];
  }

  private async fetchPageForCommit(
    commit: Commit,
    token: string,
    page: number,
  ) {
    const url = `/projects/${commit.repository.resource.id}/repository/commits/${commit.resource.id}/diff`;
    const axiosResponse = await this.httpService
      .get<GitlabDiff[]>(url, {
        headers: {
          'PRIVATE-TOKEN': token,
        },
        params: {
          per_page: 5,
          page,
        },
      })
      .toPromise();
    return axiosResponse.data;
  }
}
