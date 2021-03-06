import { FileType, Hunk, Line } from '@ceres/types';

interface LineContent {
  number: number;
  content: string;
}

export default class DiffInterpreter {
  constructor(
    private readonly hunks: Hunk[],
    private readonly fileType: FileType,
  ) {}

  async parse() {
    const parsedHunks = await Promise.all(
      this.hunks.map((hunk) => this.parseHunk(hunk)),
    );
    return parsedHunks.reduce((allHunks, currentHunks) => {
      return [...allHunks, this.createGap(), ...currentHunks];
    }, []);
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
        currentLine++;
      } else if (lineType === Line.Type.noChange) {
        hunkLines.push(
          this.createNoChange(line, leftLineNumber, rightLineNumber),
        );
        leftLineNumber++;
        rightLineNumber++;
        currentLine++;
      } else if (lineType == Line.Type.delete) {
        const { addedLines, deletedLines } = this.findGroupedChange(
          hunk.lines,
          currentLine,
          leftLineNumber,
          rightLineNumber,
        );
        hunkLines.push(...this.linkLines(deletedLines, addedLines));
        leftLineNumber += deletedLines.length;
        rightLineNumber += addedLines.length;
        currentLine += deletedLines.length + addedLines.length;
      }
    }
    return hunkLines;
  }

  private findGroupedChange(
    lines: string[],
    currentLine: number,
    leftLineNumber: number,
    rightLineNumber: number,
  ) {
    const deletedLines = this.getDeletedLines(
      leftLineNumber,
      lines,
      currentLine,
    );
    const addedLines = this.getAddedLines(rightLineNumber, lines, currentLine);
    return { deletedLines, addedLines };
  }

  private linkLines(deletedLines: LineContent[], addedLines: LineContent[]) {
    const max = Math.max(deletedLines.length, addedLines.length);
    const changes: Line[] = [];
    for (let i = 0; i < max; i++) {
      const addedLine = addedLines[i];
      const deletedLine = deletedLines[i];
      if (addedLine) {
        changes.push(
          this.createAdd(
            addedLine.content,
            addedLine.number,
            deletedLine?.content,
            deletedLine?.number,
          ),
        );
      } else {
        changes.push(
          this.createDelete(deletedLine.content, deletedLine.number),
        );
      }
    }
    return changes;
  }

  private getDeletedLines(
    leftLineNumber: number,
    lines: string[],
    currentLine: number,
  ) {
    const deletedLines: LineContent[] = [];
    let line = lines[currentLine];
    while (this.determineLineType(line) === Line.Type.delete) {
      deletedLines.push({
        number: leftLineNumber,
        content: line,
      });
      leftLineNumber++;
      line = lines[++currentLine];
    }
    return deletedLines;
  }

  private getAddedLines(
    rightLineNumber: number,
    lines: string[],
    currentLine: number,
  ) {
    const addedLines: LineContent[] = [];
    let line = lines[currentLine];
    while (this.determineLineType(line) === Line.Type.add) {
      addedLines.push({
        number: rightLineNumber,
        content: line,
      });
      rightLineNumber++;
      line = lines[++currentLine];
    }
    return addedLines;
  }

  private createAdd(
    line: string,
    lineNumber: number,
    deletedLine?: string,
    deletedLineNumber?: number,
  ): Line {
    const definition: Line = {
      type: Line.Type.add,
      right: {
        lineNumber,
        lineContent: line,
      },
    };
    if (deletedLine && deletedLineNumber) {
      definition.left = {
        lineContent: deletedLine,
        lineNumber: deletedLineNumber,
      };
    }
    return definition;
  }

  private createDelete(line: string, lineNumber: number): Line {
    return {
      type: Line.Type.delete,
      left: {
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

  private createGap(): Line {
    return {
      type: Line.Type.gap,
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
