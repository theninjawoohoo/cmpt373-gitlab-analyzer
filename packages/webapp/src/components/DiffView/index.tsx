import { Diff, Line, LINE_SCORING } from '@ceres/types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React from 'react';
import styled from 'styled-components';
import Root from './components/root';

interface DiffViewProps {
  fileName: string;
  lines: Line[];
  expanded?: boolean;
  extensions?: Diff['extensions'];
  onSummaryClick?: () => void;
}

const LINE_COLOR_MAP = {
  [Line.Type.add]: 'green',
  [Line.Type.delete]: 'red',
  [Line.Type.noChange]: 'black',
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

function renderLine(line: Line, weight: number) {
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
}

const DiffView: React.FC<DiffViewProps> = ({
  fileName,
  lines,
  expanded,
  extensions,
  onSummaryClick,
}) => {
  return (
    <Accordion expanded={expanded || false} TransitionProps={{ timeout: 0 }}>
      <AccordionSummary expandIcon={<ExpandMore />} onClick={onSummaryClick}>
        <div>
          <Typography style={{ fontFamily: 'monospace' }}>
            {fileName}
          </Typography>
          <Grid container alignItems='center' spacing={1}>
            <Grid item>
              <Typography variant='body2'>
                <strong>Score:</strong>
              </Typography>
            </Grid>
            <Grid item>
              <Chip size='small' label={extensions?.score?.toFixed(1) || 0} />
            </Grid>
            <Grid item>
              <Typography variant='body2'>
                <strong>Weight:</strong>
              </Typography>
            </Grid>
            <Grid item>
              <Chip size='small' label={extensions?.weight || 0} />
            </Grid>
            <Grid item>
              <Typography variant='body2'>
                <strong>Glob:</strong>
              </Typography>
            </Grid>
            <Grid item>
              <Chip size='small' label={extensions?.glob} />
            </Grid>
          </Grid>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Root>
          {lines?.map((line) => {
            return renderLine(line, extensions?.weight || 0);
          })}
        </Root>
      </AccordionDetails>
    </Accordion>
  );
};

export default DiffView;
