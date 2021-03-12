import { WithExtensions } from "./WithExtensions";

interface MergedBy {
    id: number;
    name: string;
    username: string;
    state: string;
    avatar_url: string;
    web_url: string;
}

interface ClosedBy {
    id: number;
    name: string;
    username: string;
    state: string;
    avatar_url: string;
    web_url: string;
}

interface Author {
    id: number;
    name: string;
    username: string;
    state: string;
    avatar_url: string;
    web_url: string;
}

interface Assignee {
    id: number;
    name: string;
    username: string;
    state: string;
    avatar_url: string;
    web_url: string;
}

interface Assignee2 {
    id: number;
    name: string;
    username: string;
    state: string;
    avatar_url: string;
    web_url: string;
}

interface Milestone {
    id: number;
    iid: number;
    project_id: number;
    title: string;
    description: string;
    state: string;
    created_at: string;
    updated_at: string;
    due_date: string;
    start_date: string;
    expired: boolean;
    web_url: string;
}

interface References {
    short: string;
    relative: string;
    full: string;
}

interface TimeStats {
    time_estimate: number;
    total_time_spent: number;
    human_time_estimate?: any;
    human_total_time_spent?: any;
}

interface TaskCompletionStatus {
    count: number;
    completed_count: number;
}

interface MergeRequestExtensions {
  lastSync?: string;
  diffScore?: number;
  commitScoreSum?: number;
}

export interface MergeRequest extends WithExtensions<MergeRequestExtensions>{
    id: number;
    iid: number;
    project_id: number;
    title: string;
    description: string;
    state: string;
    created_at: string;
    updated_at: string;
    merged_by: MergedBy;
    merged_at?: string;
    closed_by: ClosedBy;
    closed_at?: string;
    target_branch: string;
    source_branch: string;
    user_notes_count: number;
    upvotes: number;
    downvotes: number;
    author: Author;
    assignees: Assignee[];
    assignee: Assignee2;
    reviewers: any[];
    source_project_id: number;
    target_project_id: number;
    labels: string[];
    work_in_progress: boolean;
    milestone: Milestone;
    merge_when_pipeline_succeeds: boolean;
    merge_status: string;
    sha: string;
    merge_commit_sha: string;
    squash_commit_sha?: any;
    discussion_locked?: any;
    should_remove_source_branch?: any;
    force_remove_source_branch: boolean;
    reference: string;
    references: References;
    web_url: string;
    time_stats: TimeStats;
    squash: boolean;
    task_completion_status: TaskCompletionStatus;
    has_conflicts: boolean;
    blocking_discussions_resolved: boolean;
    approvals_before_merge?: any;
}
