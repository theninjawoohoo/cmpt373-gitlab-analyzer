import { GlobWeight, Repository } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useRepositoryScoringContext } from '../RepositoryScoringContext';

interface ScoringConfigDialogProps {
  repository: Repository;
}

const GlobWeightsRenderer: React.FC<{ weights: GlobWeight[] }> = ({
  weights,
}) => {
  if (weights.length === 0) {
    return (
      <Box my={2}>
        <Typography>No configuration set.</Typography>
      </Box>
    );
  }
  return (
    <Box my={2}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File pattern</TableCell>
              <TableCell>Weight</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weights.map((globWeight, index) => (
              <TableRow key={index}>
                <TableCell>{globWeight.glob}</TableCell>
                <TableCell>{globWeight.weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const ScoringConfigDialog: React.FC<ScoringConfigDialogProps> = ({
  repository,
}) => {
  const {
    showCurrentConfig,
    setShowCurrentConfig,
  } = useRepositoryScoringContext();
  const scoringConfig =
    repository?.extensions?.scoringConfig?.config?.weights || [];
  const overrides = repository?.extensions?.scoringConfig?.overrides || [];
  return (
    <Dialog
      open={showCurrentConfig}
      maxWidth='md'
      onClose={() => {
        setShowCurrentConfig(false);
      }}
    >
      <DialogContent>
        <Typography variant='h2'>Scoring Config</Typography>
        <GlobWeightsRenderer weights={scoringConfig} />
        <Typography variant='h2'>Repository Overrides</Typography>
        <GlobWeightsRenderer weights={overrides} />
      </DialogContent>
    </Dialog>
  );
};

export default ScoringConfigDialog;
