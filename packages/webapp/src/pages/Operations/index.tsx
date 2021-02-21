import { Operation } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import OperationGroup from './components/OperationGroup';

const OperationsPage: React.FC = () => {
  const { setRepositoryId } = useRepositoryContext();
  useEffect(() => {
    setRepositoryId('');
  });
  return (
    <>
      <DefaultPageLayout>
        <Container>
          <Typography variant='h1'>Operations</Typography>
          <Box my={2}>
            <Typography variant='h2'>In progress</Typography>
          </Box>
          <OperationGroup
            status={[Operation.Status.PENDING, Operation.Status.PROCESSING]}
          />
          <Box my={2}>
            <Typography variant='h2'>Completed</Typography>
          </Box>
          <OperationGroup status={[Operation.Status.COMPLETED]} />
        </Container>
      </DefaultPageLayout>
    </>
  );
};

export default OperationsPage;
