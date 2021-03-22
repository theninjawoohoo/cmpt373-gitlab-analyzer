import { MergeRequest } from '@ceres/types';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React from 'react';
import { ApiResource } from '../../../api/base';
import SmartDate from '../../../components/SmartDate';

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

const MergeRequestRenderer: React.FC<MergeRequestRendererProps> = ({
  active,
  mergeRequest,
  onClickSummary,
  children,
  shrink,
}) => {
  return (
    <Accordion expanded={active} TransitionProps={{ timeout: 0 }}>
      <AccordionSummary expandIcon={<ExpandMore />} onClick={onClickSummary}>
        <Grid container>
          <Grid item xs={shrink ? 9 : 6}>
            <Typography>{shortenTitle(mergeRequest.title, shrink)}</Typography>
            {shrink && (
              <Grid container spacing={2}>
                <Grid item>
                  <Typography>
                    <strong>Score:</strong>{' '}
                    {mergeRequest.extensions?.diffScore?.toFixed(0)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    <strong>∑ Commit Scores:</strong>{' '}
                    {mergeRequest.extensions?.commitScoreSum?.toFixed(0)}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
          {shrink ? (
            <Grid item>
              <Typography>{mergeRequest.author.name}</Typography>
              <Typography>
                <SmartDate>{mergeRequest.merged_at}</SmartDate>
              </Typography>
            </Grid>
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
              <Grid item xs={2}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      {mergeRequest.extensions?.diffScore?.toFixed(0)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {mergeRequest.extensions?.commitScoreSum?.toFixed(0)}
                    </Typography>
                  </Grid>
                </Grid>
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
