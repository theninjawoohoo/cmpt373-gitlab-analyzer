import { Diff, Line, LINE_SCORING, ScoreOverride } from '@ceres/types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';
import styled from 'styled-components';
import Root from './components/root';
import ScorePopover from './components/ScorePopper';
import CancelIcon from '@material-ui/icons/Cancel';
import ScoreOverrideForm from '../../pages/ListMergeRequestPage/components/ScoreOverrideForm';
import { useScoreOverrideQueue } from '../../pages/ListMergeRequestPage/contexts/ScoreOverrideQueue';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

const StyledAccordionSummary = styled(AccordionSummary)`
  &.MuiAccordionSummary-root.Mui-focused {
    background: none;
  }
`;

interface DiffViewProps {
  diffId?: string;
  fileName: string;
  lines: Line[];
  expanded?: boolean;
  extensions?: Diff['extensions'];
  summary?: Diff['summary'];
  onSummaryClick?: () => void;
  allowEdit?: boolean;
}

const LINE_COLOR_MAP = {
  [Line.Type.add]: 'green',
  [Line.Type.delete]: 'red',
  [Line.Type.noChange]: 'black',
};

const useStyles = makeStyles(() => ({
  accordionStyle: {
    backgroundColor: '#f8f8f8',
  },
}));

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
  summary,
  onSummaryClick,
  allowEdit,
  diffId,
}) => {
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const { add } = useScoreOverrideQueue();
  const onScoreEdit = (e: MouseEvent) => {
    // prevent the accordion from toggling
    e.stopPropagation();
    setOpen(!open);
    setAnchor(anchor ? null : e.currentTarget);
  };

  const onPopperClickAway = () => {
    setOpen(false);
    setAnchor(null);
  };

  const onSubmitPopper = (values: ScoreOverride) => {
    add({
      id: `Diff/${diffId}`,
      display: fileName,
      previousScore: score,
      defaultScore: extensions?.score,
      override: {
        ...values,
        score: values.score ? +values.score : undefined,
      },
    });
    onPopperClickAway();
  };

  const score = ScoreOverride.computeScore(
    extensions?.override,
    extensions?.score,
  );
  const isExcluded = extensions?.override?.exclude;
  const hasOverride = isExcluded || extensions?.override?.score;
  const fileNameTextDecoration = isExcluded ? 'line-through' : '';
  const classes = useStyles();
  return (
    <Accordion
      expanded={expanded || false}
      TransitionProps={{ timeout: 0 }}
      className={classes.accordionStyle}
    >
      <StyledAccordionSummary
        expandIcon={<ExpandMore />}
        onClick={onSummaryClick}
      >
        <Box width='100%'>
          <Grid container alignItems='center' justify='space-between'>
            <Grid item>
              <Grid container alignItems='center' spacing={2}>
                {hasOverride && (
                  <Grid item>
                    <WarningIcon />
                  </Grid>
                )}
                <Grid item>
                  <Typography
                    style={{
                      fontFamily: 'monospace',
                      textDecoration: fileNameTextDecoration,
                    }}
                  >
                    {fileName}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {allowEdit && (
              <>
                <Grid item>
                  <IconButton onClick={onScoreEdit as any}>
                    <CancelIcon fontSize='small' />
                  </IconButton>
                </Grid>
              </>
            )}
          </Grid>
          <Grid container alignItems='center' spacing={1}>
            <Grid item>
              <Typography variant='body2'>
                <strong>Score:</strong>
              </Typography>
            </Grid>
            <Grid item>
              <ScorePopover
                scoreCount={score.toFixed(1)}
                scoreSummary={summary}
              />
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
        </Box>
      </StyledAccordionSummary>
      {open && (
        <ScoreOverrideForm
          open={open}
          anchor={anchor}
          onClickAway={onPopperClickAway}
          onSubmit={onSubmitPopper}
          defaultValues={extensions?.override}
        />
      )}
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
