import { StagedScoreOverride } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { useUpdateScoreOverrides } from '../../../api/scoring';
import { useRepositoryContext } from '../../../contexts/RepositoryContext';
import { useScoreOverrideQueue } from '../contexts/ScoreOverrideQueue';

interface OverrideRowProps {
  stagedOverride: StagedScoreOverride;
}

function newScoreDisplay(stagedOverride: StagedScoreOverride): React.ReactNode {
  if (stagedOverride.override?.exclude) {
    return 0;
  }
  if (stagedOverride.override?.score) {
    return stagedOverride.override.score;
  }
  return stagedOverride.defaultScore;
}

const OverrideRow: React.FC<OverrideRowProps> = ({ stagedOverride }) => {
  return (
    <>
      <Grid item xs={2}>
        <DialogContentText>{stagedOverride.previousScore}</DialogContentText>
      </Grid>
      <Grid item xs={2}>
        <DialogContentText>{newScoreDisplay(stagedOverride)}</DialogContentText>
      </Grid>
      <Grid item xs={8}>
        <Box>
          <DialogContentText>{stagedOverride.display}</DialogContentText>
        </Box>
        {stagedOverride.override.comment && (
          <Box>
            <DialogContentText>
              <strong>Comment: </strong>
              {stagedOverride.override.comment}
            </DialogContentText>
          </Box>
        )}
      </Grid>
    </>
  );
};

const ScoreOverrideQueueInfo: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { queue, reset } = useScoreOverrideQueue();
  const { mutate: update } = useUpdateScoreOverrides();
  const { repositoryId } = useRepositoryContext();

  const handleUpdate = () => {
    update(
      {
        repositoryId,
        overrides: queue,
      },
      {
        onSuccess: () => {
          setShowDialog(false);
        },
      },
    );
  };

  return (
    <>
      {queue.length > 0 && (
        <Box my={2}>
          <Alert
            severity='info'
            action={
              <Button
                size='small'
                color='inherit'
                onClick={() => setShowDialog(true)}
              >
                Review
              </Button>
            }
          >
            There are pending score override changes.
          </Alert>
        </Box>
      )}
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
        maxWidth='xl'
      >
        <DialogTitle>Score Overrides</DialogTitle>
        <DialogContent style={{ minWidth: '60vw' }}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <DialogContentText>
                <strong>Current Score</strong>
              </DialogContentText>
            </Grid>
            <Grid item xs={2}>
              <DialogContentText>
                <strong>New Score</strong>
              </DialogContentText>
            </Grid>
            <Grid item xs={8}>
              <DialogContentText>
                <strong>Description</strong>
              </DialogContentText>
            </Grid>
            {queue.map((override) => (
              <OverrideRow key={override.id} stagedOverride={override} />
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            onClick={() => {
              reset();
              setShowDialog(false);
            }}
          >
            Discard
          </Button>
          <Button color='primary' variant='contained' onClick={handleUpdate}>
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScoreOverrideQueueInfo;
