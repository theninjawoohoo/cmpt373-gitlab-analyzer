import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, withDefaults } from '../../../common/query-dto';
import { MergeRequest } from '../../merge-request/merge-request.entity';
import { Commit } from '../commit/commit.entity';
import { DiffQueryDto } from './diff-query.dto';
import { Diff as DiffEntity } from './diff.entity';
import {
  DeepPartial,
  Repository as TypeORMRepository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  Diff,
  Extensions,
  FileType,
  GlobWeight,
  Line,
  LINE_SCORING,
  ScoreOverride,
} from '@ceres/types';
import { parsePatch } from 'diff';
import DiffInterpreter from './helpers/DiffInterpreter';
import { isMatch } from 'picomatch';
import { BaseService } from '../../../common/base.service';

type GitlabDiff = Omit<Diff, 'hunks' | 'lines'>;

@Injectable()
export class DiffService extends BaseService<Diff, DiffEntity, DiffQueryDto> {
  constructor(
    readonly httpService: HttpService,
    @InjectRepository(DiffEntity)
    private readonly diffRepository: TypeORMRepository<DiffEntity>,
  ) {
    super(diffRepository, 'diff', httpService);
  }

  buildFilters(
    query: SelectQueryBuilder<DiffEntity>,
    filters: DiffQueryDto,
  ): SelectQueryBuilder<DiffEntity> {
    if (filters.commit) {
      query.andWhere('diff.commit_id = :commit', { commit: filters.commit });
    }

    if (filters.merge_request) {
      query.andWhere('diff.merge_request_id = :mergeRequest', {
        mergeRequest: filters.merge_request,
      });
    }

    paginate(query, filters);
    return query;
  }

  buildSort(
    query: SelectQueryBuilder<DiffEntity>,
    sortKey?: string,
    order?: 'ASC' | 'DESC',
  ): SelectQueryBuilder<DiffEntity> {
    return query.orderBy("diff.resource #>> '{new_path}'", 'DESC');
  }

  async updateOverride(id: string, override: ScoreOverride) {
    const diff = await this.diffRepository.findOne({ id });
    diff.resource = Extensions.updateExtensions(diff.resource, {
      override: override,
    });
    return this.diffRepository.save(diff);
  }

  async syncForCommit(commit: Commit, token: string) {
    let diffs: GitlabDiff[] = [];
    let page = 1;
    await this.diffRepository.delete({ commit: commit });
    do {
      diffs = await this.fetchPageForCommit(commit, token, page);
      const parsedDiffs = await Promise.all(
        diffs.map(this.addParsedDefinitions),
      );
      await this.createAll({ commit }, parsedDiffs);
      page++;
    } while (diffs.length > 0);
  }

  async calculateDiffScore(filters: DiffQueryDto, weights: GlobWeight[] = []) {
    const [diffs] = await this.search(filters);
    const updatedDiffs = diffs.map((diff) => {
      const summary = diff.resource?.summary;
      let score = 0;
      if (summary) {
        score = Object.keys(summary)
          .map(
            (lineType) =>
              (LINE_SCORING[lineType] || 0) * (summary[lineType] || 0),
          )
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      }
      const weight = this.getWeight(diff.resource.new_path, weights);
      diff.resource = Extensions.updateExtensions(diff.resource, {
        score: score * weight.weight,
        ...weight,
      });
      return diff;
    });
    await this.diffRepository.save(updatedDiffs);
    const score = updatedDiffs
      .map((diff) =>
        ScoreOverride.computeScore(
          diff.resource?.extensions.override,
          diff.resource?.extensions?.score,
        ),
      )
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const hasOverride = updatedDiffs.some((diff) =>
      ScoreOverride.hasOverride(diff?.resource?.extensions?.override),
    );
    return {
      score,
      hasOverride,
    };
  }

  async syncForMergeRequest(mergeRequest: MergeRequest, token: string) {
    const diffs = await this.fetchForMergeRequest(mergeRequest, token);
    const parsedDiffs = await Promise.all(diffs.map(this.addParsedDefinitions));
    await this.createAll({ mergeRequest }, parsedDiffs);
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

  private async addParsedDefinitions(diff: GitlabDiff): Promise<Diff> {
    const hunks = parsePatch(diff.diff)[0].hunks;
    const interpreter = new DiffInterpreter(hunks, FileType.typescript);
    const lines = await interpreter.parse();
    const summary = {};
    Object.values(Line.Type).forEach((lineType) => {
      summary[lineType] = lines.filter((line) => line.type === lineType).length;
    });
    return {
      ...diff,
      hunks,
      lines,
      summary,
    };
  }

  private async fetchForMergeRequest(
    mergeRequest: MergeRequest,
    token: string,
  ) {
    const url = `/projects/${mergeRequest.repository.resource.id}/merge_requests/${mergeRequest.resource.iid}/changes`;
    const axiosResponse = await this.fetchWithRetries_noType(
      token,
      url,
      undefined,
      5,
    );
    return axiosResponse.data.changes as GitlabDiff[];
  }

  private async fetchPageForCommit(
    commit: Commit,
    token: string,
    page: number,
  ) {
    const url = `/projects/${commit.repository.resource.id}/repository/commits/${commit.resource.id}/diff`;
    const params = { per_page: 5, page: page };
    const axiosResponse = await this.fetchWithRetries<GitlabDiff>(
      token,
      url,
      params,
      5,
    );
    return axiosResponse.data;
  }

  private getWeight(path: string, weights: GlobWeight[] = []) {
    for (let i = weights.length - 1; i >= 0; i--) {
      if (
        isMatch(path, weights[i].glob, {
          basename: !weights[i].glob.includes('/'),
        })
      ) {
        return weights[i];
      }
    }
    return {
      weight: 1,
      glob: '*',
    };
  }
}
