export interface ScoreOverride {
  score?: number;
  exclude?: boolean;
  comment?: string;
  user?: {
    id: string;
    display: string;
  };
}
