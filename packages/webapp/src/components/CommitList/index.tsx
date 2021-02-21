//import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container, Accordion, Box } from '@material-ui/core';
import React, { useState } from 'react';
import { AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useCommitsForRepository } from '../../api/commit';
import { useParams } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';

// const useStyles = makeStyles(() => ({

// }));W

const CommitList: React.FC = () => {
  //const styles = useStyles();
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(0);
  const { data: commits } = useCommitsForRepository(id, page);

  console.log(commits);

  return (
    <Container>
      <Typography variant='h1'>Commit list</Typography>
      {commits?.results.map((commit) => {
        return (
          <Accordion key={commit.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={commit.id + '-content'}
              id={commit.id + '-header'}
            >
              <Typography>{commit.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{'Message: ' + commit.message}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
      <Box my={2} display='flex' justifyContent='center'>
        <Pagination
          page={page + 1}
          count={Math.ceil(commits?.total / 10)}
          onChange={(e, page) => setPage(page - 1)}
        />
      </Box>
    </Container>
  );
};

export default CommitList;
