import { MergeRequest } from '@ceres/types';
import { useTheme } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React from 'react';
import { ApiResource } from '../../../api/base';
import ScoringChip from '../../../components/ScoringChip';
import SmartDate from '../../../components/SmartDate';
import { useFilterContext } from '../../../contexts/FilterContext';

interface MergeRequestRendererProps {
  mergeRequest: ApiResource<MergeRequest>;
  active?: boolean;
  onClickSummary?: () => void;
  shrink?: boolean;
}

function shortenTitle(title: string, shrink?: boolean) {
  const maxLength = shrink ? 50 : 60;
  if (title.length < maxLength) {
    return title;
  }
  return title.substr(0, maxLength) + '...';
}

function getSumAndHasOverride(
  emails: string[],
  commitScoreSums: MergeRequest['extensions']['commitScoreSums'],
) {
  let hasOverride = false;
  let score = 0;
  Object.keys(commitScoreSums).forEach((authorEmail) => {
    if (emails.length === 0 || emails.includes(authorEmail)) {
      hasOverride = commitScoreSums[authorEmail].hasOverride || hasOverride;
      score += commitScoreSums[authorEmail].sum;
    }
  });
  return {
    hasOverride,
    score,
  };
}

const MergeRequestRenderer: React.FC<MergeRequestRendererProps> = ({
  active,
  mergeRequest,
  onClickSummary,
  children,
  shrink,
}) => {
  const theme = useTheme();
  const { emails } = useFilterContext();
  const {
    hasOverride: commitHasOverride,
    score: commitScoreSum,
  } = getSumAndHasOverride(
    emails || [],
    mergeRequest.extensions?.commitScoreSums || {},
  );
  return (
    <Accordion
      expanded={active}
      TransitionProps={{ timeout: 0, unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        onClick={onClickSummary}
        style={{ background: active ? theme.palette.primary.light : '' }}
      >
        <Grid container>
          <Grid item xs={shrink ? 8 : 6}>
            <Typography>{shortenTitle(mergeRequest.title, shrink)}</Typography>
            {shrink && (
              <Grid container justify='space-between'>
                <Typography variant='body2' color='textSecondary'>
                  {mergeRequest.author.name}
                </Typography>
                <Box pr={4}>
                  <Typography variant='body2' color='textSecondary'>
                    <SmartDate>{mergeRequest.merged_at}</SmartDate>
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          {shrink ? (
            <>
              <Grid item xs={2}>
                <Typography align='right'>
                  <ScoringChip
                    hasOverride={mergeRequest?.extensions?.diffHasOverride}
                  >
                    {mergeRequest.extensions?.diffScore?.toFixed(1)}
                  </ScoringChip>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography align='right'>
                  <ScoringChip hasOverride={commitHasOverride}>
                    {commitScoreSum?.toFixed(1)}
                  </ScoringChip>
                </Typography>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={2}>
                <Typography>{mergeRequest.author.name}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  <SmartDate>{mergeRequest.merged_at}</SmartDate>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography align='right'>
                  <ScoringChip
                    hasOverride={mergeRequest?.extensions?.diffHasOverride}
                  >
                    {mergeRequest.extensions?.diffScore?.toFixed(1)}
                  </ScoringChip>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography align='right'>
                  <ScoringChip hasOverride={commitHasOverride}>
                    {commitScoreSum?.toFixed(1)}
                  </ScoringChip>
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </AccordionSummary>
      <Box component={AccordionDetails} display='block'>
        {children}
      </Box>
    </Accordion>
  );
};

export default MergeRequestRenderer;
