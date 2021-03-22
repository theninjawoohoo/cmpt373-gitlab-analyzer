import { Repository } from '@ceres/types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import React, { useState } from 'react';

interface LeaveRepositoryProps {
  repository: Repository;
  onLeave: () => void;
}

const LeaveRepository: React.FC<LeaveRepositoryProps> = ({
  repository,
  onLeave,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div>
      <Alert
        severity='info'
        action={
          <Button
            size='small'
            color='inherit'
            onClick={() => {
              setShowDialog(true);
            }}
          >
            Leave
          </Button>
        }
      >
        This snapshot belongs to{' '}
        <strong>{repository?.extensions?.owner?.display}</strong>. You were
        invited to this snapshot as a collaborator.
      </Alert>
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <DialogTitle>Leave Snapshot?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you leave this snapshot, you will need to be re-invited by the
            snapshot owner to gain access.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            onClick={() => {
              setShowDialog(false);
            }}
          >
            No
          </Button>
          <Button color='primary' onClick={onLeave}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeaveRepository;
