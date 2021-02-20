export interface Operation {
  type: Operation.Type;
  owner: string;
  start_time?: string;
  end_time?: string;
  status: Operation.Status;
  stages: Operation.Stage[];
  output?: {
    errors?: { code: string, payload: any }[];
    warnings?: { code: string, payload: any }[];
    artifacts: any[];
  };
  input?: any;
  subscribers?: string[];
}

export namespace Operation {
  export enum Type {
    FETCH_REPOSITORIES = 'fetch-repositories',
    SYNC_REPOSITORY = 'sync-repository',
  }

  export enum Status {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    TERMINATED = 'terminated',
  }

  export interface Stage {
    name: string;
    percentage: number | false;
    start_time?: string;
    end_time?: string;
    status: Operation.Status;
  }

  export interface SyncRepositoryPayload {
    repository_id: string;
  }

  export function buildSyncRepositoryPayload(repositoryId: string) {
    return {
      type: Operation.Type.SYNC_REPOSITORY,
      input: {
        repository_id: repositoryId,
      }
    }
  }
}