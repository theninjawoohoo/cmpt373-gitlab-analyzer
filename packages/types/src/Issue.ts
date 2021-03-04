interface Author {
    id: number;
    name: string;
    username: string;
    state: string;
    web_url: string;
    avatar_url: string;
}

interface Milestone {
    project_id: number;
    description: string;
    id: number;
    iid: number;
    title: string;
    state: string;
    due_date: string;
    created_at: string;
    updated_at: string;
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

interface Links {
    self: string;
    notes: string;
    award_emoji: string;
    project: string;
}

interface TaskCompletionStatus {
    count: number;
    completed_count: number;
}

export interface Issue {
    id: number;
    iid: number;
    title: string;
    created_at: string;
    moved_to_id?: any;
    labels: string[];
    state: string;
    description: string;
    author: Author;
    upvotes: number;
    downvotes: number;
    merge_requests_count: number;
    user_notes_count: number;
    milestone: Milestone;
    due_date: string;
    project_id: number;
    assignees: Assignee[];
    assignee: Assignee2;
    updated_at: string;
    closed_at: string;
    closed_by: string;
    web_url: string;
    references: References;
    time_stats: TimeStats;
    has_tasks: boolean;
    task_status: string;
    confidential: boolean;
    discussion_locked: boolean;
    _links: Links;
    task_completion_status: TaskCompletionStatus;
}