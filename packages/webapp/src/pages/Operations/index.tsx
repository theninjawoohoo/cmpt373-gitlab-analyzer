import { Operation } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useGetOperations } from '../../api/operation';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import OperationProgress from './components/OperationProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

const OperationsPage: React.FC = () => {
  const {
    data: completedOperations,
    isLoading: completedLoading,
  } = useGetOperations({
    status: [Operation.Status.COMPLETED],
  });
  const {
    data: inProgressOperations,
    isLoading: inProgressLoading,
  } = useGetOperations({
    status: [Operation.Status.PROCESSING, Operation.Status.PENDING],
  });
  return (
    <>
      <DefaultPageLayout>
        <Container>
          <Typography variant='h1'>Operations</Typography>
          <Box my={2}>
            <Typography variant='h2'>In progress</Typography>
          </Box>
          {inProgressLoading ? (
            <Box textAlign='center' py={3}>
              <CircularProgress />
            </Box>
          ) : (
            inProgressOperations?.results.map((operation) => (
              <OperationProgress
                key={operation.meta.id}
                operation={operation}
              />
            ))
          )}
          <Box my={2}>
            <Typography variant='h2'>Completed</Typography>
          </Box>
          {completedLoading ? (
            <Box textAlign='center' py={3}>
              <CircularProgress />
            </Box>
          ) : (
            completedOperations?.results.map((operation) => (
              <OperationProgress
                key={operation.meta.id}
                operation={operation}
              />
            ))
          )}
        </Container>
      </DefaultPageLayout>
    </>
  );
};

export default OperationsPage;
