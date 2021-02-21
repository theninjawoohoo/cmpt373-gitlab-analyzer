import { Typography, Container, Accordion, Box } from '@material-ui/core';
import { parse } from 'querystring';
import React, { useState } from 'react';
import { AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useGetCommits } from '../../api/commit';
import { useLocation } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';

const CommitList: React.FC = () => {
  const location = useLocation();
  const query = parse(location.search.replace(/^\?/, ''));
  const [page, setPage] = useState(0);
  const { data: commits } = useGetCommits(
    {
      repository: query.repository as string,
      merge_request: query.merge_request as string,
    },
    page,
  );

  return (
    <Container>
      <Typography variant='h1'>Commit list</Typography>
      {commits?.results.map((commit) => {
        return (
          <Accordion key={commit.meta.id}>
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
