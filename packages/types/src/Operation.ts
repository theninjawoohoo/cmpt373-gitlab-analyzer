export interface Operation {
  type: Operation.Type;
  owner: string;
  status: {
    start_time?: string;
    end_time?: string;
    stage: Operation.Stage;
  };
  output?: {
    errors?: { code: string, payload: any }[];
    warnings?: { code: string, payload: any }[];
    artifacts: any[];
  };
  input?: any;
}

export namespace Operation {
  export enum Type {
    FETCH_REPOSITORIES = 'fetch-repositories',
  }

  export enum Stage {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    TERMINATED = 'terminated',
  }
}