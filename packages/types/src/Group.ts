//{
// name: "",
// repositories: [{
// id: '', display: '',
// id: '', display: '',
// id: '', display: '',
// }],
// iterations: [{
// name: '', start: '', end: '',
// name: '', start: '', end: '',
// name: '', start: '', end: '',
// }]
// }
export interface Iteration {
  name: string;
  start: string;
  end: string;
}

export interface GroupConfig {
  name: string;
  repositories: { id: string; display: string }[];
  iteration: Iteration[];
}
