import { Operation } from '@ceres/types';
import { AccordionDetails } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React from 'react';
import { ApiResource } from '../../../api/base';
import StageProgress from './StageProgress';

interface OperationProgressProps {
  operation: ApiResource<Operation>;
}

const OperationProgress: React.FC<OperationProgressProps> = ({ operation }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box
          width='100%'
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <div>
            <Typography>{operation.type}</Typography>
            <Typography variant='body2'>
              {new Date(operation.meta.createdAt).toDateString()}
              {' - '}
              {new Date(operation.start_time).toLocaleTimeString('en-US')}
            </Typography>
          </div>
          <Box>
            {operation.stages.map((stage) => (
              <StageProgress key={stage.name} stage={stage} />
            ))}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {operation?.stages.map((stage) => (
            <>
              <Grid item xs={6}>
                <Typography>{stage.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{stage.status}</Typography>
              </Grid>
            </>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default OperationProgress;
