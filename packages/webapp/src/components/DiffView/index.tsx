import { Line } from '@ceres/types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React from 'react';
import Root from './components/root';

interface DiffViewProps {
  fileName: string;
  lines: Line[];
  expanded?: boolean;
  onSummaryClick?: () => void;
}

const LINE_COLOR_MAP = {
  [Line.Type.add]: 'green',
  [Line.Type.delete]: 'red',
  [Line.Type.noChange]: 'black',
};

const LineRenderer: React.FC<{
  color?: string;
  lineNumber?: number;
  content?: string;
}> = ({ color, lineNumber, content }) => {
  if (!content) {
    return <Box />;
  }
  return (
    <Box display='flex' alignItems='center'>
      <Box component={Typography} width='2rem'>
        {lineNumber}
      </Box>
      <pre
        style={{
          color,
          margin: '0',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      >
        {content}
      </pre>
    </Box>
  );
};

function renderLine(line: Line) {
  if (line.type === Line.Type.add && line.left) {
    return (
      <>
        <LineRenderer
          color={LINE_COLOR_MAP[Line.Type.delete]}
          lineNumber={line.left.lineNumber}
          content={line.left.lineContent}
        />
        <LineRenderer
          color={LINE_COLOR_MAP[Line.Type.add]}
          lineNumber={line.right.lineNumber}
          content={line.right.lineContent}
        />
      </>
    );
  }
  return (
    <>
      <LineRenderer
        color={LINE_COLOR_MAP[line.type]}
        lineNumber={line.left?.lineNumber}
        content={line.left?.lineContent}
      />
      <LineRenderer
        color={LINE_COLOR_MAP[line.type]}
        lineNumber={line.right?.lineNumber}
        content={line.right?.lineContent}
      />
    </>
  );
}

const DiffView: React.FC<DiffViewProps> = ({
  fileName,
  lines,
  expanded,
  onSummaryClick,
}) => {
  return (
    <Accordion expanded={expanded || false} TransitionProps={{ timeout: 0 }}>
      <AccordionSummary expandIcon={<ExpandMore />} onClick={onSummaryClick}>
        <Typography style={{ fontFamily: 'monospace' }}>{fileName}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Root>
          {lines?.map((line) => {
            return renderLine(line);
          })}
        </Root>
      </AccordionDetails>
    </Accordion>
  );
};

export default DiffView;
