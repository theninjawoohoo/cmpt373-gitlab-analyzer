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

export const LINE_SCORING: { [key in Line.Type]: number } = {
  [Line.Type.gap]: 0,
  [Line.Type.add]: 1,
  [Line.Type.delete]: 0.2,
  [Line.Type.noChange]: 0,
  [Line.Type.syntax]: 0.2,
  [Line.Type.comment]: 0,
}

interface RenderContent {
  lineNumber: number;
  lineContent: string;
}
