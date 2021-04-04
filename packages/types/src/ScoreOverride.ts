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
}

export namespace StagedScoreOverride {
  export function getDiffOverrides(overrides: StagedScoreOverride[]) {
    return overrides
      .filter((override) => parseEntityId(override.id).entity === 'Diff')
  }
  export function parseEntityId(entityId: string) {
    const [entity, id] = entityId.split('/');
    return { entity, id };
  }
}


