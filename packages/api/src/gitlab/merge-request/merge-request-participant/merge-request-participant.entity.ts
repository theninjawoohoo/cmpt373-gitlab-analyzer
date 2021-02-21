import { MergeRequestParticipant as MergeRequestParticipantResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { MergeRequest } from '../merge-request.entity';

@Entity('merge_request_participant')
export class MergeRequestParticipant extends BaseEntity<MergeRequestParticipantResource> {
  @ManyToOne(() => MergeRequest, (mergeRequest) => mergeRequest.participants)
  @JoinColumn({ name: 'merge_request_id' })
  mergeRequest: MergeRequest;
}
