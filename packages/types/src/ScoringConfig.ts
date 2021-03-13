export interface GlobWeight {
  glob: string;
  weight: number;
}

export interface ScoringConfig {
  name: string;
  weights: GlobWeight[];
}
