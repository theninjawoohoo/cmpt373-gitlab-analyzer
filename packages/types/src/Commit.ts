export interface Commit {
  id: string;
  short_id: string;
  created_at: string;
  parent_ids: string[];
  title: string;
  message: string;
  author_name: string;
  author_email: string;
  authored_date: string;
  committer_name: string;
  committer_email: string;
  committed_date: string;
  web_url: string;
}

export namespace Commit {
  export interface Author {
    author_name: string;
    author_email: string;
    repository_member_id?: string;
  }
  export interface DailyCount {
    author_email: string;
    author_name: string;
    date: string;
    count: number;
  }
}