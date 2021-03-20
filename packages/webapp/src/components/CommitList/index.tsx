import { Typography, Container, Accordion } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { parse } from 'querystring';
import React, { useState } from 'react';
import { AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useGetCommits } from '../../api/commit';
import { Link, useLocation } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import Button from '@material-ui/core/Button/Button';
import Box from '@material-ui/core/Box';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import MemberDropdown from '../MemberDropdown';
import { useFilterContext } from '../../contexts/FilterContext';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';

const CommitList: React.FC = () => {
  const location = useLocation();
  const query = parse(location.search.replace(/^\?/, ''));
  const [page, setPage] = useState(0);
  const { emails } = useFilterContext();
  const { repositoryId } = useRepositoryContext();
  const { data: commits } = useGetCommits(
    {
      repository: query.repository as string,
      merge_request: query.merge_request as string,
      author_email: emails,
    },
    page,
  );
  const { elements } = useFilterContext();
  console.log(elements);
  return (
    <Container>
      <Grid container justify='space-between' alignItems='center'>
        <Grid item>
          <DefaultPageTitleFormat>Commit List</DefaultPageTitleFormat>
        </Grid>
        <Grid item>
          <MemberDropdown repositoryId={repositoryId} />
        </Grid>
      </Grid>
      {commits?.results.map((commit) => {
        return (
          <Accordion key={commit.meta.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={commit.id + '-content'}
              id={commit.id + '-header'}
            >
              <div>
                <Typography>{commit.title}</Typography>
                <Typography variant='body2'>
                  {new Date(commit.authored_date).toDateString()}
                  {' - '}
                  {new Date(commit.authored_date).toLocaleTimeString('en-US')}
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{'Message: ' + commit.message + '\n'}</Typography>
            </AccordionDetails>
            <AccordionDetails>
              <Typography>{'Author: ' + commit.author_name}</Typography>
            </AccordionDetails>
            <Divider />
            <AccordionSummary>
              <Grid container justify='flex-end'>
                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    component={Link}
                    to={`/diff?commit=${commit.meta.id}`}
                  >
                    View Diff
                  </Button>
                </Grid>
              </Grid>
            </AccordionSummary>
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
