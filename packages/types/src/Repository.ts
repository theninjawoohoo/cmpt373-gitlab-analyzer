// Generated using: http://json2ts.com/
import { ScoringConfig } from './ScoringConfig';
import { WithExtensions } from './WithExtensions';

interface Namespace {
  id: number;
  name: string;
  path: string;
  kind: string;
  full_path: string;
  parent_id?: any;
  avatar_url: string;
  web_url: string;
}

interface Links {
  self: string;
  issues: string;
  merge_requests: string;
  repo_branches: string;
  labels: string;
  events: string;
  members: string;
}

interface Owner {
  id: number;
  name: string;
  username: string;
  state: string;
  avatar_url: string;
  web_url: string;
}

interface ContainerExpirationPolicy {
  cadence: string;
  enabled: boolean;
  keep_n?: number;
  older_than: string;
  name_regex: string;
  name_regex_keep?: any;
  next_run_at: string;
}

interface ProjectAccess {
  access_level: number;
  notification_level: number;
}

interface GroupAccess {
  access_level: number;
  notification_level: number;
}

interface Permissions {
  project_access: ProjectAccess;
  group_access: GroupAccess;
}

interface RepositoryExtensions {
  lastSync?: string;
  scoringConfig?: {
    config?: ScoringConfig;
    id?: string;
    lastRan?: string;
  };
  owner?: {
    id: string;
    display: string;
  };
  collaborators?: {
    id: string;
    display: string;
    accessLevel: Repository.AccessLevel;
  }[];
}

export interface Repository extends WithExtensions<RepositoryExtensions> {
  id: number;
  description: string;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  created_at: string;
  default_branch: string;
  tag_list: any[];
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  readme_url: string;
  avatar_url: string;
  forks_count: number;
  star_count: number;
  last_activity_at: string;
  namespace: Namespace;
  _links: Links;
  packages_enabled?: boolean;
  empty_repo: boolean;
  archived: boolean;
  visibility: string;
  owner: Owner;
  resolve_outdated_diff_discussions?: boolean;
  container_registry_enabled: boolean;
  container_expiration_policy: ContainerExpirationPolicy;
  issues_enabled: boolean;
  merge_requests_enabled: boolean;
  wiki_enabled: boolean;
  jobs_enabled: boolean;
  snippets_enabled: boolean;
  service_desk_enabled: boolean;
  service_desk_address?: any;
  can_create_merge_request_in: boolean;
  issues_access_level: string;
  repository_access_level: string;
  merge_requests_access_level: string;
  forking_access_level: string;
  wiki_access_level: string;
  builds_access_level: string;
  snippets_access_level: string;
  pages_access_level: string;
  operations_access_level: string;
  analytics_access_level: string;
  emails_disabled?: any;
  shared_runners_enabled: boolean;
  lfs_enabled: boolean;
  creator_id: number;
  import_status: string;
  open_issues_count: number;
  ci_default_git_depth?: number;
  ci_forward_deployment_enabled?: boolean;
  public_jobs: boolean;
  build_timeout: number;
  auto_cancel_pending_pipelines: string;
  build_coverage_regex?: any;
  ci_config_path?: any;
  shared_with_groups: any[];
  only_allow_merge_if_pipeline_succeeds: boolean;
  allow_merge_on_skipped_pipeline?: boolean;
  request_access_enabled: boolean;
  only_allow_merge_if_all_discussions_are_resolved: boolean;
  remove_source_branch_after_merge?: boolean;
  printing_merge_request_link_enabled: boolean;
  merge_method: string;
  suggestion_commit_message: string;
  auto_devops_enabled: boolean;
  auto_devops_deploy_strategy: string;
  autoclose_referenced_issues: boolean;
  permissions: Permissions;
}

export namespace Repository {
  export enum AccessLevel {
    editor = 'editor',
    viewer = 'viewer',
  }

  export enum Role {
    owner = 'owner',
    collaborator = 'collaborator',
  }
}
