// Generated from http://json2ts.com/
// Hunk is not from Gitlab, it's the output of parsePatch from the diff package
import { Line } from './Line';
import { WithExtensions } from './WithExtensions';

export interface Hunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
  linedelimiters: string[];
}

interface DiffExtensions {
  weight?: number;
  glob?: string;
  score?: number;
}

export interface Diff extends WithExtensions<DiffExtensions> {
  old_path: string;
  new_path: string;
  a_mode: string;
  b_mode: string;
  new_file: boolean;
  renamed_file: boolean;
  deleted_file: boolean;
  diff: string;
  hunks: Hunk[];
  lines?: Line[];
  summary?: { [key in Line.Type]?: number };
}
