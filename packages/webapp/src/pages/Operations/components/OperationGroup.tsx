import { Operation } from '@ceres/types';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState } from 'react';
import { useGetOperations } from '../../../api/operation';
import OperationProgress from './OperationProgress';

interface OperationGroupProps {
  status: Operation.Status[];
}

const OperationGroup: React.FC<OperationGroupProps> = ({ status }) => {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useGetOperations({
    status,
  });
  return (
    <>
      {isLoading ? (
        <Box textAlign='center' py={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {data?.results.map((operation) => (
            <OperationProgress key={operation.meta.id} operation={operation} />
          ))}
          <Box my={2} display='flex' justifyContent='center'>
            <Pagination
              page={page + 1}
              count={Math.ceil(data.total / 10)}
              onChange={(e, page) => setPage(page - 1)}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default OperationGroup;
