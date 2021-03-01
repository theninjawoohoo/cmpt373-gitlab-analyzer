import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, withDefaults } from '../../../common/query-dto';
import { MergeRequest } from '../../merge-request/merge-request.entity';
import { Commit } from '../commit/commit.entity';
import { DiffQueryDto } from './diff-query.dto';
import { CommitQueryDto } from '../commit/commit-query.dto';
import { Diff as DiffEntity } from './diff.entity';
import { DeepPartial, Repository as TypeORMRepository } from 'typeorm';
import { Diff, FileType, Line } from '@ceres/types';
import { parsePatch } from 'diff';
import DiffInterpreter from './helpers/DiffInterpreter';

type GitlabDiff = Omit<Diff, 'hunks' | 'lines'>;

@Injectable()
export class DiffService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(DiffEntity)
    private readonly diffRepository: TypeORMRepository<DiffEntity>,
  ) {}

  search(filters: DiffQueryDto) {
    filters = withDefaults(filters);
    const query = this.diffRepository.createQueryBuilder('diff');

    if (filters.commit) {
      query.andWhere('diff.commit_id = :commit', { commit: filters.commit });
    }

    if (filters.merge_request) {
      query.andWhere('diff.merge_request_id = :mergeRequest', {
        mergeRequest: filters.merge_request,
      });
    }

    paginate(query, filters);
    return query.getManyAndCount();
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

  async calculateDiffScore(filters: DiffQueryDto){
    filters = withDefaults(filters);
    const query = this.diffRepository.createQueryBuilder('diff');
    var score = 0;
    if(filters.commit){
      query.andWhere('diff.commit_id = :commit', { commit: filters.commit });
    }
    else if (filters.merge_request) {
      query.andWhere('diff.merge_request_id = :mergeRequest', {
        mergeRequest: filters.merge_request,
      });
    }
    paginate(query, filters);
    let diffs = query.getManyAndCount();
    // await console.log(diffs);
    await diffs.then(function(result) {
      // console.log(result[1])
      for (var index = 0; index < result[1]; index++){
        var diff = result[0][index].resource.hunks[0].lines;
        // console.log(diff);
        var commentFlag = false;
        diff.forEach(line => {
          console.log(line)
          if (line.match('^\\+\\/\\*')){
            commentFlag = true;
            return;
          }
          if (line.match('\\*\\/$')){
            commentFlag = false;
            return;
          }
          if (line.match('^\\+//')){
            return;
          }
          if (line.match('^\\+.')){
            if (line.match('[a-zA-Z1-9]') && commentFlag == false){
              console.log("add");
              score+=1;
            }
            else if (commentFlag == false){
              console.log("syntax");
              score+=0.2;
            }
          }
          else if (line.match('^\\-.') && commentFlag == false){
            console.log("delete");
            score+=0.2
          }
        });
      }

      // console.log(score);
    });
    console.log(score);
    return score;
    
    // return diffs;
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
