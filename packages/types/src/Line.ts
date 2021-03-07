export interface Line {
  type: Line.Type;
  left?: RenderContent;
  right?: RenderContent;
}

export namespace Line {
  export enum Type {
    gap = 'gap',
    add = 'add',
    delete = 'delete',
    noChange = 'no-change',
    syntax = 'syntax',
    comment = 'comment',
  }
}

interface RenderContent {
  lineNumber: number;
  lineContent: string;
}