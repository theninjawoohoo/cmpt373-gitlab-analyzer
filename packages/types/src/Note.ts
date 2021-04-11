import { WithExtensions } from "./WithExtensions";

interface Author {
  id: number;
  username: string;
  email: string;
  name: string;
  state: string;
  created_at: string;
}

interface NoteExtensions {
  wordCount?: number;
}

export interface Note extends WithExtensions<NoteExtensions> {
  id: number;
  body: string;
  attachment: string;
  author: Author;
  created_at: string;
  updated_at: string;
  system: boolean;
  noteable_id: number;
  noteable_type: string;
  noteable_iid: number;
  resolvable: boolean;
  confidential: boolean;
}

export namespace Note {
  export enum Type {
    issueComment = 'issue-comment',
    mergeRequestComment = 'merge-request-comment',
  }
  export interface DailyCount {
    date: string;
    count: number;
    wordCount: number;
  }
}
