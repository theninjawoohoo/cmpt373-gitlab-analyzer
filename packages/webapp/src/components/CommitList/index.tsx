//import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container, Accordion } from '@material-ui/core';
import React from 'react';
import { AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getCommitsForRepository } from '../../api/commit';

// const useStyles = makeStyles(() => ({

// }));W

const CommitList: React.FC = () => {
  //const styles = useStyles();
  const { data: commits } = getCommitsForRepository(
    '4f80988c-e172-4fb7-9ffc-c260eee761ad',
  );

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
              <Typography>{commit.message}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Container>
  );
};

export default CommitList;
