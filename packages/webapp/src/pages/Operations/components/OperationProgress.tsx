import { Operation } from '@ceres/types';
import { AccordionDetails } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React from 'react';
import StageProgress from './StageProgress';

interface OperationProgressProps {
  operation: Operation;
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
          <Typography>{operation.type}</Typography>
          <Box>
            {operation.stages.map((stage) => (
              <StageProgress key={stage.name} stage={stage} />
            ))}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>Something</AccordionDetails>
    </Accordion>
  );
};

export default OperationProgress;
