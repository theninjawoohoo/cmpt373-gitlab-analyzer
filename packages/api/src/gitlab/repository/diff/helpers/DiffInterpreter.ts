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
    while (currentLine < hunk.lines.length) {
      const line = hunk.lines[currentLine];
      // let newline= line.substring(1).trim();
      const lineType = this.determineLineType(line);
      if (lineType === Line.Type.add) {
        commentFlag = this.checkAddLineType(line, hunkLines,rightLineNumber,commentFlag);
        rightLineNumber++;
        currentLine++;
      }else if (lineType === Line.Type.noChange) {
        hunkLines.push(
          this.createNoChange(line, leftLineNumber, rightLineNumber),
        );
        leftLineNumber++;
        rightLineNumber++;
        currentLine++;
      }else if (lineType == Line.Type.delete) {
        let returnValue = this.checkDeleteLineType(line, hunkLines, hunk, leftLineNumber, rightLineNumber, currentLine, commentFlag);
        leftLineNumber = returnValue[0];
        rightLineNumber = returnValue[1];
        currentLine = returnValue[2];
        leftLineNumber++;
        currentLine++;
      }
    }
    return hunkLines;
  }

  private checkAddLineType(
    line: string, 
    hunkLines:Line[], 
    LineNumber: number, 
    commentFlag: boolean
    ) {
    let newline= line.substring(1).trim();
    console.log(line);
    if(line.trim() === "+"){
      hunkLines.push(this.createBlank(line, LineNumber, true));
    }
    else if (newline.substring(0,2) === "//" || commentFlag){
      console.log(commentFlag);
      hunkLines.push(this.createComment(line, LineNumber, true));
    }
    else if (newline.substring(0,2) === "/*"){
      hunkLines.push(this.createComment(line, LineNumber, true));
      commentFlag = true;
      console.log(commentFlag);
    }
    else if(newline.substring(line.length - 2) === "*/" && commentFlag){
      hunkLines.push(this.createComment(line, LineNumber, true));
      commentFlag = false;
      console.log(commentFlag);
    }
    else if (!line.match('[a-zA-Z1-9]')){
      hunkLines.push(this.createSyntax(line, LineNumber, true));
    }
    else{
      hunkLines.push(this.createAdd(line, LineNumber));
    }

    return commentFlag;
  };

  private checkDeleteLineType(
    line: string, 
    hunkLines:Line[], 
    hunk: Hunk, 
    leftLineNumber: number, 
    rightLineNumber: number, 
    currentLine: number, 
    commentFlag: boolean
    ) {
    let newline= line.substring(1).trim();
    console.log(line);
    console.log(newline);
    console.log(leftLineNumber);
    console.log(rightLineNumber);
    if(line.trim() === "-"){
      hunkLines.push(this.createBlank(line, leftLineNumber, false));
    }
    else if (newline.substring(0,2) === "//" || commentFlag){
      hunkLines.push(this.createComment(line, leftLineNumber, false));
    }
    else if (newline.substring(0,2) === "/*"){
      hunkLines.push(this.createComment(line, leftLineNumber, false));
      commentFlag = true;
    }
    else if(newline.substring(line.length - 2) === "*/" && commentFlag){
      hunkLines.push(this.createComment(line, leftLineNumber, false));
      commentFlag = false;
    }
    else if (!line.match('[a-zA-Z1-9]')){
      hunkLines.push(this.createSyntax(line, leftLineNumber, false));
    }
    else{
      const { addedLine, deletedLine } = this.findGroupedChange(
        hunk.lines,
        currentLine,
        leftLineNumber,
        rightLineNumber,
      );
      hunkLines.push(...this.linkLine(deletedLine, addedLine));
      rightLineNumber += 1;
      currentLine += 1;
    }

    return [leftLineNumber, rightLineNumber, currentLine];
  }

  // First read a delte line and the matching add line
  private findGroupedChange(
    lines: string[],
    currentLine: number,
    leftLineNumber: number,
    rightLineNumber: number,
  ) {
    const deletedLine = this.getDeletedLine(
      leftLineNumber,
      lines,
      currentLine,
    );
    const addedLine = this.getAddedLine(
      rightLineNumber,
      lines,
      currentLine + 1,
    );
    return { deletedLine, addedLine };
  }

  // In the case when deletions are followed directly by an addition, we want to render
  // the deletion on the left side and the addition on the right side on the same line.
  // This helpers function creates the left and right side on the same line.
  private linkLine(deletedLine: LineContent, addedLine: LineContent) {
    const changes: Line[] = [];
    if (addedLine) {
      let lineChange = this.getLineChange(addedLine,deletedLine);
      if (lineChange == ""){
        changes.push(
          this.createSpaceChange(
            addedLine.content,
            addedLine.number,
            deletedLine.content,
            deletedLine.number,
          ),
        );
      }
      else if (!lineChange.match('[a-zA-Z1-9]')){
        changes.push(
          this.createSyntaxChange(
            addedLine.content,
            addedLine.number,
            deletedLine.content,
            deletedLine.number,
          ),
        );
      }
      else{
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
      changes.push(
        this.createDelete(deletedLine.content, deletedLine.number),
      );
    }
    return changes;
  }

  // Get different between the added line and deleted line. Helper for `linkLine`
  private getLineChange(addedLine: LineContent, deletedLine: LineContent){
    let added = addedLine.content.substring(1).split("");
    let deleted = addedLine.content.substring(1).split("");
    let long = added;
    let short = deleted;
    if (added.length < deleted.length){
      long = deleted;
      short = added;
    }
    for(let i =0; i<short.length; i++){
      for(let j =0; j<long.length;j++){
        if (short[i] === long[j]){
          long[j]="";
          break;
        }
      }
    }
    console.log("diff"+ long.join('').trim());
    return long.join('').trim();
  }

  // Read the deleted line. Helper for `findGroupedChange`
  private getDeletedLine(
    leftLineNumber: number,
    lines: string[],
    currentLine: number,
  ) {
    let line = lines[currentLine];
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
    const addedLines: LineContent = {
      number: rightLineNumber,
      content: line,
    };
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

  private createComment(line: string, lineNumber: number, add: boolean): Line {
    if(add){
      return {
        type: Line.Type.comment,
        right: {
          lineNumber,
          lineContent: line,
        },
      };
    }
    else{
      return {
        type: Line.Type.comment,
        left: {
          lineNumber,
          lineContent: line,
        },
      };
    }
  }

  private createBlank(line: string, lineNumber: number, add: boolean): Line {
    if(add){
      return {
        type: Line.Type.blank,
        right: {
          lineNumber,
          lineContent: line,
        },
      };
    }
    else{
      return {
        type: Line.Type.blank,
        left: {
          lineNumber,
          lineContent: line,
        },
      };
    }
  }

  private createSyntax(line: string, lineNumber: number, add: boolean): Line {
    if(add){
      return {
        type: Line.Type.syntaxLine,
        right: {
          lineNumber,
          lineContent: line,
        },
      };
    }
    else{
      return {
        type: Line.Type.syntaxLine,
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

  private createSpaceChange(
    line: string,
    lineNumber: number,
    deletedLine: string,
    deletedLineNumber: number,
  ): Line {
    return {
      type: Line.Type.spaceChange,
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

  private createSyntaxChange(
    line: string,
    lineNumber: number,
    deletedLine: string,
    deletedLineNumber: number,
  ): Line {
    return {
      type: Line.Type.syntaxChange,
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
