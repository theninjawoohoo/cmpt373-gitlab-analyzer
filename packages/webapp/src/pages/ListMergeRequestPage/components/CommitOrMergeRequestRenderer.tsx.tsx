import { MergeRequest, Commit } from '@ceres/types';
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

interface MergeRequestRendererProps {
  mergeRequest?: ApiResource<MergeRequest>;
  commit?: ApiResource<Commit>;
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

const CommitOrMergeRequestRenderer: React.FC<MergeRequestRendererProps> = ({
  active,
  mergeRequest,
  commit,
  onClickSummary,
  children,
  shrink,
}) => {
  const theme = useTheme();
  const title = mergeRequest ? mergeRequest?.title : commit?.title;
  const author = mergeRequest
    ? mergeRequest?.author.name
    : commit?.committer_name;

  const date = mergeRequest ? mergeRequest?.merged_at : commit?.created_at;
  const diffHasOverride = mergeRequest
    ? mergeRequest?.extensions?.diffHasOverride
    : commit?.extensions?.diffHasOverride;

  const commitHasOverride = mergeRequest
    ? mergeRequest?.extensions?.diffHasOverride
    : false;

  const commitScoreSum = mergeRequest
    ? mergeRequest?.extensions?.commitScoreSum.toFixed(1)
    : commit?.extensions?.score.toFixed(1);

  const diffScoreSum = mergeRequest
    ? mergeRequest?.extensions?.diffScore.toFixed(1)
    : commit?.extensions?.score.toFixed(1);

  const accordionColor = mergeRequest ? '' : '#f7ebef';
  return (
    <Accordion expanded={active} TransitionProps={{ timeout: 0 }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        onClick={onClickSummary}
        style={{
          background: active ? theme.palette.primary.light : accordionColor,
        }}
      >
        <Grid container>
          <Grid item xs={shrink ? 8 : 6}>
            <Typography>{shortenTitle(title, shrink)}</Typography>
            {shrink && (
              <Grid container justify='space-between'>
                <Typography variant='body2' color='textSecondary'>
                  {author}
                </Typography>
                <Box pr={4}>
                  <Typography variant='body2' color='textSecondary'>
                    <SmartDate>{date}</SmartDate>
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          {shrink ? (
            <>
              <Grid item xs={2}>
                <Typography align='right'>
                  <ScoringChip hasOverride={diffHasOverride}>
                    {diffScoreSum}
                  </ScoringChip>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography align='right'>
                  <ScoringChip hasOverride={commitHasOverride}>
                    {commitScoreSum}
                  </ScoringChip>
                </Typography>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={2}>
                <Typography>{author}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  <SmartDate>{date}</SmartDate>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography align='right'>
                  <ScoringChip hasOverride={diffHasOverride}>
                    {diffScoreSum}
                  </ScoringChip>
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography align='right'>
                  <ScoringChip hasOverride={commitHasOverride}>
                    {commitScoreSum}
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

export default CommitOrMergeRequestRenderer;
