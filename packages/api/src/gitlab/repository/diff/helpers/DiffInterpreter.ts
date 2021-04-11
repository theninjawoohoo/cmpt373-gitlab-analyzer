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
    let commentFlag = false;
    let deletedLineIndex = 0;
    let result : (number|boolean)[] = [];
    while (currentLine < hunk.lines.length) {
      const line = hunk.lines[currentLine];
      const lineType = this.determineLineType(line);
      if (lineType === Line.Type.add) {
        deletedLineIndex=0;
        commentFlag = this.checkAddLineType(
          line,
          hunkLines,
          rightLineNumber,
          commentFlag,
        );
        rightLineNumber++;
        currentLine++;
      } else if (lineType === Line.Type.noChange) {
        deletedLineIndex=0;
        hunkLines.push(
          this.createChange(
            line,
            rightLineNumber,
            line,
            leftLineNumber,
            Line.Type.noChange,
          ),
        );
        leftLineNumber++;
        rightLineNumber++;
        currentLine++;
      } else if (lineType == Line.Type.delete) {
        deletedLineIndex++;
        result = this.checkDeleteLineType(
          line,
          hunkLines,
          hunk,
          leftLineNumber,
          rightLineNumber,
          currentLine,
          commentFlag,
          deletedLineIndex
        );
        rightLineNumber = <number>result[0];
        currentLine = <number>result[1];
        commentFlag = <boolean>result[2];
        leftLineNumber++;
        currentLine++;
      }
    }
    return hunkLines;
  }

  private checkAddLineType(
    line: string,
    hunkLines: Line[],
    LineNumber: number,
    commentFlag: boolean,
  ) {
    const result = this.createBlankCommentAndSyntax(
      line,
      hunkLines,
      LineNumber,
      commentFlag,
      true,
    );
    const pushed = result[0];
    commentFlag = result[1];
    if (!pushed) {
      hunkLines.push(this.createAdd(line, LineNumber));
    }
    return commentFlag;
  }

  private checkDeleteLineType(
    line: string,
    hunkLines: Line[],
    hunk: Hunk,
    leftLineNumber: number,
    rightLineNumber: number,
    currentLine: number,
    commentFlag: boolean,
    deletedLineIndex: number
  ) {
    const result = this.createBlankCommentAndSyntax(
      line,
      hunkLines,
      leftLineNumber,
      commentFlag,
      false,
    );
    const pushed = result[0];
    commentFlag = result[1];
    if (!pushed) {
      const { addedLine, deletedLine } = this.findGroupedChange(
        hunk.lines,
        currentLine,
        leftLineNumber,
        rightLineNumber,
        deletedLineIndex
      );
      hunkLines.push(...this.linkLine(deletedLine, addedLine));
      if(addedLine){
        rightLineNumber += 1;
      }
      currentLine += 1;
    }

    return [rightLineNumber, currentLine, commentFlag];
  }

  private createBlankCommentAndSyntax(
    line: string,
    hunkLines: Line[],
    LineNumber: number,
    commentFlag: boolean,
    added: boolean,
  ) {
    let pushed = false;
    if (line.trim() === '+' || line.trim() === '-') {
      hunkLines.push(this.createLine(line, LineNumber, added, Line.Type.blank));
      pushed = true;
    }
    if (!pushed) {
      const result = this.createComment(
        line,
        hunkLines,
        LineNumber,
        commentFlag,
        added,
      );
      pushed = result[0];
      commentFlag = result[1];
    }
    if (!pushed && !line.match('[a-zA-Z1-9]')) {
      hunkLines.push(
        this.createLine(line, LineNumber, added, Line.Type.syntaxLine),
      );
      pushed = true;
    }
    return [pushed, commentFlag];
  }

  private createComment(
    line: string,
    hunkLines: Line[],
    LineNumber: number,
    commentFlag: boolean,
    added: boolean,
  ) {
    let pushed = false;
    const newline = line.substring(1).trim();
    let commentSign = '';
    let commentSectionStart = '';
    let commentSectionEnd = '';
    if (this.fileType == FileType.sql || this.fileType == FileType.haskell) {
      commentSign = '--';
    }
    if (this.fileType == FileType.haskell) {
      commentSectionStart = '{--';
      commentSectionEnd = '--}';
    } else if (this.fileType == FileType.html) {
      commentSectionStart = '<!--';
      commentSectionEnd = '-->';
    } else {
      commentSign = '//';
      commentSectionStart = '/*';
      commentSectionEnd = '*/';
    }

    if (
      commentSign.length > 0 &&
      newline.substring(0, commentSign.length) === commentSign
    ) {
      hunkLines.push(
        this.createLine(line, LineNumber, added, Line.Type.comment),
      );
      pushed = true;
    } else {
      if (
        commentFlag ||
        (commentSectionStart.length > 0 &&
          newline.substring(0, commentSectionStart.length) ===
            commentSectionStart)
      ) {
        hunkLines.push(
          this.createLine(line, LineNumber, added, Line.Type.comment),
        );
        pushed = true;
        commentFlag = true;
      }
      if (
        commentSectionEnd.length > 0 &&
        newline.substring(line.length - commentSectionEnd.length) ===
          commentSectionEnd
      ) {
        commentFlag = false;
      }
    }
    return [pushed, commentFlag];
  }

  // First read a delte line and the matching add line
  private findGroupedChange(
    lines: string[],
    currentLine: number,
    leftLineNumber: number,
    rightLineNumber: number,
    deletedLineIndex: number
  ) {
    let deletedLineCount=0;
    const deletedLine = this.getDeletedLine(leftLineNumber, lines, currentLine);
    let currentTemp = currentLine;
    while (this.determineLineType(lines[currentTemp]) === Line.Type.delete) {
      deletedLineCount++;
      currentTemp++;
    }

    const addedLine = this.getAddedLine(
      rightLineNumber,
      lines,
      currentLine + deletedLineCount + deletedLineIndex,
    );
    return { deletedLine, addedLine };
  }

  // In the case when deletions are followed directly by an addition, we want to render
  // the deletion on the left side and the addition on the right side on the same line.
  // This helpers function creates the left and right side on the same line.
  private linkLine(deletedLine: LineContent, addedLine: LineContent) {
    const changes: Line[] = [];
    if (addedLine) {
      const lineChange = this.getLineChange(addedLine, deletedLine);
      if (lineChange == '') {
        changes.push(
          this.createChange(
            addedLine.content,
            addedLine.number,
            deletedLine.content,
            deletedLine.number,
            Line.Type.spaceChange,
          ),
        );
      } else if (!lineChange.match('[a-zA-Z1-9]')) {
        changes.push(
          this.createChange(
            addedLine.content,
            addedLine.number,
            deletedLine.content,
            deletedLine.number,
            Line.Type.syntaxChange,
          ),
        );
      } else {
        changes.push(
          this.createAdd(
            addedLine.content,
            addedLine.number,
            deletedLine?.content,
            deletedLine?.number,
          ),
        );
      }
    } else {
      changes.push(this.createDelete(deletedLine.content, deletedLine.number));
    }
    return changes;
  }

  // Get different between the added line and deleted line. Helper for `linkLine`
  private getLineChange(addedLine: LineContent, deletedLine: LineContent) {
    const added = addedLine.content.substring(1).split('');
    const deleted = deletedLine.content.substring(1).split('');
    let long = added;
    let short = deleted;
    if (added.length < deleted.length) {
      long = deleted;
      short = added;
    }
    for (let i = 0; i < short.length; i++) {
      for (let j = 0; j < long.length; j++) {
        if (short[i] === long[j]) {
          long[j] = '';
          break;
        }
      }
    }
    return long.join('').trim();
  }

  // Read the deleted line. Helper for `findGroupedChange`
  private getDeletedLine(
    leftLineNumber: number,
    lines: string[],
    currentLine: number,
  ) {
    const line = lines[currentLine];
    const deletedLines: LineContent = {
      number: leftLineNumber,
      content: line,
    };
    return deletedLines;
  }

  // Read the added line. Helper for `findGroupedChange`
  private getAddedLine(
    rightLineNumber: number,
    lines: string[],
    currentLine: number,
  ) {
    let line = lines[currentLine];
    let addedLines: LineContent;
    if (this.determineLineType(line) === Line.Type.add) {
      addedLines = {
        number: rightLineNumber,
        content: line,
      };
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
    // If this line was added at the same time as a line was deleted, store
    // the deleted line as the left side.
    if (deletedLine && deletedLineNumber) {
      definition.left = {
        lineContent: deletedLine,
        lineNumber: deletedLineNumber,
      };
    }
    return definition;
  }

  private createLine(
    line: string,
    lineNumber: number,
    add: boolean,
    type: Line.Type,
  ): Line {
    if (add) {
      return {
        type: type,
        right: {
          lineNumber,
          lineContent: line,
        },
      };
    } else {
      return {
        type: type,
        left: {
          lineNumber,
          lineContent: line,
        },
      };
    }
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

  private createChange(
    line: string,
    lineNumber: number,
    deletedLine: string,
    deletedLineNumber: number,
    type: Line.Type,
  ): Line {
    return {
      type: type,
      left: {
        lineContent: deletedLine,
        lineNumber: deletedLineNumber,
      },
      right: {
        lineContent: line,
        lineNumber: lineNumber,
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
