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
}

function shortenTitle(title: string) {
  if (title.length < 60) {
    return title;
  }
  return title.substr(0, 60) + '...';
}

const MergeRequestRenderer: React.FC<MergeRequestRendererProps> = ({
  active,
  mergeRequest,
  onClickSummary,
  children,
}) => {
  return (
    <Accordion expanded={active} TransitionProps={{ timeout: 0 }}>
      <AccordionSummary expandIcon={<ExpandMore />} onClick={onClickSummary}>
        <Grid container>
          <Grid item xs={6}>
            <Typography>{shortenTitle(mergeRequest.title)}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>{mergeRequest.author.name}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>
              <SmartDate>{mergeRequest.merged_at}</SmartDate>
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <Box component={AccordionDetails} display='block'>
        {children}
      </Box>
    </Accordion>
  );
};

export default MergeRequestRenderer;
