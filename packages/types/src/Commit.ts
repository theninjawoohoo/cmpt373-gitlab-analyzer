export interface Commit {
  id: string;
  short_id: string;
  created_at: Date;
  parent_ids: string[];
  title: string;
  message: string;
  author_name: string;
  author_email: string;
  authored_date: Date;
  committer_name: string;
  committer_email: string;
  committed_date: Date;
  web_url: string;
}

export namespace Commit {
  export interface DailyCount {
    author_email: string;
    date: string;
    count: number;
  }
}