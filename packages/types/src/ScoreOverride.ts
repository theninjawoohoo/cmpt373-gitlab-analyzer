export interface ScoreOverride {
  score?: number;
  exclude?: boolean;
  comment?: string;
  user?: {
    id: string;
    display: string;
  };
}

export interface StagedScoreOverride {
  id: string;
  display: string;
  previousScore: number;
  defaultScore: number;
  override: ScoreOverride;
}

export namespace ScoreOverride {
  export function computeScore(override?: ScoreOverride, computed?: number) {
    if (override?.exclude) {
      return 0;
    }
    return +(override?.score || computed || 0);
  }
  export function hasOverride(override?: ScoreOverride) {
    return override?.exclude || !!override?.score;
  }
}

export namespace StagedScoreOverride {
  export function getDiffOverrides(overrides: StagedScoreOverride[]) {
    return overrides
      .filter((override) => parseEntityId(override.id).entity === 'Diff')
  }
  export function getCommitOverrides(overrides: StagedScoreOverride[]) {
    return overrides
      .filter((override) => parseEntityId(override.id).entity === 'Commit')
  }
  export function getMergeRequestOverrides(overrides: StagedScoreOverride[]) {
    return overrides
      .filter((override) => parseEntityId(override.id).entity === 'MergeRequest')
  }
  export function parseEntityId(entityId: string) {
    const [entity, id] = entityId.split('/');
    return { entity, id };
  }
}


