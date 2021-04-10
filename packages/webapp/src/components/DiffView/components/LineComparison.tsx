import { Line, LINE_SCORING } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const LINE_COLOR_MAP = {
  [Line.Type.add]: 'green',
  [Line.Type.delete]: 'red',
  [Line.Type.noChange]: 'black',
  [Line.Type.syntaxChange]: 'blue',
  [Line.Type.spaceChange]: 'blue',
  [Line.Type.comment]: '#bebebe',
  [Line.Type.syntaxLine]: '#bebebe',
  [Line.Type.blank]: '#bebebe',
};

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0;
`;

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

const LineWrapper: React.FC<{ tooltip: string }> = ({ children, tooltip }) => {
  return (
    <Tooltip title={tooltip}>
      <TwoColumnGrid>{children}</TwoColumnGrid>
    </Tooltip>
  );
};

interface LineComparisonProps {
  line: Line;
  weight: number;
}

const LineComparison: React.FC<LineComparisonProps> = ({ line, weight }) => {
  const tooltip = `${line.type}: ${LINE_SCORING[line.type]} × ${weight}`;
  if (line.type === Line.Type.add && line.left) {
    return (
      <LineWrapper tooltip={tooltip}>
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
      </LineWrapper>
    );
  }
  return (
    <LineWrapper tooltip={tooltip}>
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
    </LineWrapper>
  );
};

export default LineComparison;
