import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import React from 'react';

interface LoadMoreProps {
  onClick: () => void;
  loading?: boolean;
}

const LoadMore = React.forwardRef<HTMLDivElement, LoadMoreProps>(
  ({ onClick, loading }, ref) => {
    return (
      <Grid alignItems='center' justify='center' container ref={ref}>
        <Grid item>
          <Box m={2}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button onClick={onClick}>Load More</Button>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  },
);

LoadMore.displayName = 'LoadMore';

export default LoadMore;
