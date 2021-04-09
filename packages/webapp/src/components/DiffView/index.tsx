import { Diff, Line, ScoreOverride } from '@ceres/types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';
import styled from 'styled-components';
import Root from './components/root';
import ScorePopover from './components/ScorePopper';
import CancelIcon from '@material-ui/icons/Cancel';
import ScoreOverrideForm from '../../pages/ListMergeRequestPage/components/ScoreOverrideForm';
import { useScoreOverrideQueue } from '../../pages/ListMergeRequestPage/contexts/ScoreOverrideQueue';
import WarningIcon from '@material-ui/icons/Warning';
import LineComparison from './components/LineComparison';
import { makeStyles } from '@material-ui/core/styles';

const StyledAccordionSummary = styled(AccordionSummary)`
  &.MuiAccordionSummary-root.Mui-focused {
    background: none;
  }
`;

const DiffFactWrapper: React.FC<{
  name: React.ReactNode;
  value: React.ReactNode;
}> = ({ name, value }) => {
  return (
    <Grid container justify='space-between' alignItems='center' spacing={2}>
      <Grid item>
        <Typography variant='body2'>
          <strong>{name}:</strong>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant='body2'>{value}</Typography>
      </Grid>
    </Grid>
  );
};

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

  const useStyles = makeStyles(() => ({
    accordionStyle: {
      backgroundColor: '#f8f8f8',
    },
  }));

  const isExcluded = extensions?.override?.exclude;
  const hasOverride = ScoreOverride.hasOverride(extensions?.override);
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
          <Grid container alignItems='center' spacing={2}>
            <Grid item xs={2}>
              <DiffFactWrapper
                name='Score'
                value={
                  <ScorePopover
                    hasOverride={hasOverride}
                    scoreCount={score.toFixed(1)}
                    scoreSummary={summary}
                  />
                }
              />
            </Grid>
            <Grid item xs={2}>
              <DiffFactWrapper name='Weight' value={extensions?.weight || 0} />
            </Grid>
            <Grid item>
              <DiffFactWrapper name='Filetype' value={extensions?.glob} />
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
          {lines?.map((line, index) => (
            <LineComparison
              key={index}
              line={line}
              weight={extensions?.weight || 0}
            />
          ))}
        </Root>
      </AccordionDetails>
    </Accordion>
  );
};

export default DiffView;
