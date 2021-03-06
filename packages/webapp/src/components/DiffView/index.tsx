import { Hunk } from '@ceres/types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React from 'react';
import Root from './components/root';

interface DiffViewProps {
  fileName: string;
  hunks: Hunk[];
}

interface Line {
  type: 'added' | 'deleted' | 'unchanged' | 'blank';
  content?: string;
  lineNumber?: number;
}

const LINE_COLOR_MAP = {
  added: 'green',
  deleted: 'red',
  unchanged: 'black',
};

const LineRenderer: React.FC<{ line: Line }> = ({ line }) => {
  if (line.type === 'blank') {
    return <Box />;
  }
  const color = LINE_COLOR_MAP[line.type];
  return (
    <Box display='flex' alignItems='center'>
      <Box component={Typography} width='2rem'>
        {line.lineNumber}
      </Box>
      <pre
        style={{
          color,
          margin: '0',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      >
        {line.content}
      </pre>
    </Box>
  );
};

function computeLines(hunk: Hunk) {
  let leftLineNumber = hunk.oldStart;
  let rightLineNumber = hunk.newStart;
  const lines = [] as { left: Line; right: Line }[];
  for (let i = 0; i < hunk.lines.length; i++) {
    const line = hunk.lines[i];
    const firstChar = line.charAt(0);
    const restOfLine = line.substr(1);
    if (firstChar === '+') {
      lines.push({
        left: { type: 'blank' },
        right: {
          type: 'added',
          content: restOfLine,
          lineNumber: rightLineNumber++,
        },
      });
    } else if (firstChar === '-') {
      let j = i;
      let currentLine = hunk.lines[i];
      const left = [] as Line[];
      const right = [] as Line[];
      while (currentLine?.charAt(0) === '-') {
        left.push({
          type: 'deleted',
          content: currentLine.substr(1),
          lineNumber: leftLineNumber++,
        });
        currentLine = hunk.lines[++j];
      }
      while (currentLine?.charAt(0) === '+') {
        right.push({
          type: 'added',
          content: currentLine.substr(1),
          lineNumber: rightLineNumber++,
        });
        currentLine = hunk.lines[++j];
      }
      const max = Math.max(left.length, right.length);
      for (let m = 0; m < max; m++) {
        lines.push({
          left: left[m] || { type: 'blank' },
          right: right[m] || { type: 'blank' },
        });
      }
      i = j - 1;
    } else {
      lines.push({
        left: {
          type: 'unchanged',
          content: restOfLine,
          lineNumber: leftLineNumber++,
        },
        right: {
          type: 'unchanged',
          content: restOfLine,
          lineNumber: rightLineNumber++,
        },
      });
    }
  }
  return lines;
}

const DiffView: React.FC<DiffViewProps> = ({ fileName, hunks }) => {
  return (
    <Accordion defaultExpanded={false}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography style={{ fontFamily: 'monospace' }}>{fileName}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Root>
          {hunks.map((hunk) => {
            const lines = computeLines(hunk);
            return (
              <>
                {lines.map((line) => {
                  return (
                    <>
                      <LineRenderer line={line.left} />
                      <LineRenderer line={line.right} />
                    </>
                  );
                })}
                <div>...</div>
                <div>...</div>
              </>
            );
          })}
        </Root>
      </AccordionDetails>
    </Accordion>
  );
};

export default DiffView;
