import { FileType, Hunk, Line } from '@ceres/types';

export default class DiffInterpreter {
  private lines: Line[] = [];

  constructor(
    private readonly hunks: Hunk[],
    private readonly fileType: FileType,
  ) {}

  async parse() {
    const lines;
  }

  private async parseHunk(hunk: Hunk) {
    let currentLine = 0;
    // Left and right numbers are usually not the same
    let leftLineNumber = hunk.oldStart;
    let rightLineNumber = hunk.newStart;

    const hunkLines: Line[] = [];
    while (currentLine < hunk.lines.length) {
      const line = hunk.lines[currentLine];
      const lineType = this.determineLineType(line);
      if (lineType === Line.Type.add) {
        hunkLines.push(this.createAdd(line, rightLineNumber));
        rightLineNumber++;
      } else if (lineType === Line.Type.noChange) {
        hunkLines.push(
          this.createNoChange(line, leftLineNumber, rightLineNumber),
        );
        leftLineNumber++;
        rightLineNumber++;
      }
      currentLine++;
    }
  }

  private handleDelete(
    lines: string[],
    currentLine: number,
    leftLineNumber: number,
    rightLineNumber: number,
  ) {
    const deletedLines = [];
    const addedLines = [];
  }

  private createAdd(line: string, lineNumber: number): Line {
    return {
      type: Line.Type.add,
      right: {
        lineNumber,
        lineContent: line,
      },
    };
  }

  private createNoChange(
    line: string,
    leftLineNumber: number,
    rightLineNumber: number,
  ): Line {
    return {
      type: Line.Type.noChange,
      left: {
        lineContent: line,
        lineNumber: leftLineNumber,
      },
      right: {
        lineContent: line,
        lineNumber: rightLineNumber,
      },
    };
  }

  private determineLineType(line: string) {
    const firstChar = line.charAt(0);
    if (firstChar === '+') {
      return Line.Type.add;
    }
    if (firstChar === '-') {
      return Line.Type.delete;
    }
    return Line.Type.noChange;
  }
}
