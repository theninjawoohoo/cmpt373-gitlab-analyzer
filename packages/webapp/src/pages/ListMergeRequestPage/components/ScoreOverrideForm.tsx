import { ScoreOverride } from '@ceres/types';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import React from 'react';

interface ScoreOverrideFormProps {
  defaultValues?: ScoreOverride;
  open?: boolean;
}

const ScoreOverrideForm: React.FC<ScoreOverrideFormProps> = ({ open }) => {
  return (
    <Popper open={open}>
      <Typography>Override me!</Typography>
    </Popper>
  );
};

export default ScoreOverrideForm;
