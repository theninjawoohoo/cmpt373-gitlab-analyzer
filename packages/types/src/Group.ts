export interface Iteration {
  name: string;
  start: string;
  end: string;
}

export interface LinkedRepositories {
  id: string;
  display: string;
}

export interface GroupConfig {
  name: string;
  repositories: LinkedRepositories[];
  iteration: Iteration[];
}
