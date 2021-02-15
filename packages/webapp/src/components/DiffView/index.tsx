import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ExpandMore } from '@material-ui/icons';
import React from 'react';
import Root from './components/root';

interface DiffViewProps {
  fileName: string;
  hunks: Hunk[];
}

interface Line {
  type: 'added' | 'deleted' | 'unchanged';
  content: string;
}

export interface Hunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
  linedelimiters: string[];
}

const LINE_COLOR_MAP = {
  added: 'green',
  deleted: 'red',
  unchanged: 'black',
};

const LineRenderer: React.FC<{ line: Line }> = ({ line }) => {
  const color = LINE_COLOR_MAP[line.type];
  return <p style={{ color }}>{line.content}</p>;
};

function computeLines(hunks: Hunk) {
  const left = [] as Line[];
  const right = [] as Line[];
  hunks.lines.forEach((line) => {
    const firstChar = line.charAt(0);
    const restOfLine = line.substr(1);
    if (firstChar === '+') {
      right.push({ type: 'added', content: restOfLine });
    } else if (firstChar === '-') {
      left.push({ type: 'deleted', content: restOfLine });
    } else {
      left.push({ type: 'unchanged', content: restOfLine });
      right.push({ type: 'unchanged', content: restOfLine });
    }
  });
  return {
    left,
    right,
  };
}

// eslint-disable-next-line react/prop-types
const DiffView: React.FC<DiffViewProps> = ({ fileName, hunks }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography style={{ fontFamily: 'monospace' }}>{fileName}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Root>
          {hunks.map((hunk) => {
            const { left, right } = computeLines(hunk);
            return (
              <>
                <pre>
                  {left.map((line) => (
                    <LineRenderer key={line.content} line={line} />
                  ))}
                </pre>
                <pre>
                  {right.map((line) => (
                    <LineRenderer key={line.content} line={line} />
                  ))}
                </pre>
              </>
            );
          })}
        </Root>
      </AccordionDetails>
    </Accordion>
  );
};

export default DiffView;
