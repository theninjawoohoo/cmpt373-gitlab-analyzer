import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const DefaultPageTitleFormat: React.FC = ({ children }) => {
  return (
    <Box my={4}>
      <Typography variant='h1'>{children}</Typography>
    </Box>
  );
};

export default DefaultPageTitleFormat;
