import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
// import { DateTime } from 'luxon';
// import { useFilterContext } from '../../contexts/FilterContext';
import { useGetIssueNotes, useGetMergeRequestNotes } from '../../api/note';
// import { useParams } from 'react-router-dom';
import NotePaper from './NotePaper';
import { useGetMergeRequestById } from '../../api/mergeRequests';
import { useGetIssueById } from '../../api/issue';
// import { ApiResource } from '../../api/base';
// import { Note } from '@ceres/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    paper: {
      width: '100%',
      marginLeft: 5,
      marginBottom: 10,
      padding: 15,
    },
  }),
);

enum TabOption {
  codeReview = 'code reviews',
  issueNotes = 'issue notes',
}

const Comment: React.FC = () => {
  const classes = useStyles();

  const merge_request_id = '6cc45a67-e562-4014-982c-8973a36d5743';
  const mergeRequest = useGetMergeRequestById(merge_request_id);
  const issue_id = '61d75c79-8afc-4e59-9b3b-fa994727ea66';
  // const { startDate, endDate, emails } = useFilterContext();
  const { data: mergeRequestNotes } = useGetMergeRequestNotes(merge_request_id);
  const { data: issueNotes } = useGetIssueNotes(issue_id);
  const issue = useGetIssueById(issue_id);

  const [tab, setTab] = useState(TabOption.codeReview);
  const isMergeRequestNote = tab === TabOption.codeReview;
  const notes =
    tab === TabOption.codeReview
      ? mergeRequestNotes?.results || []
      : issueNotes?.results || [];

  const handleTabs = (event: React.ChangeEvent<unknown>, newTab: any) => {
    setTab(newTab);
  };

  return (
    <>
      <Container>
        <DefaultPageTitleFormat>Comments</DefaultPageTitleFormat>
        <Box my={2} className={classes.root}>
          <Tabs
            value={tab}
            onChange={handleTabs}
            indicatorColor='primary'
            textColor='primary'
            centered
          >
            <Tab value={TabOption.codeReview} label='Code Reviews' />
            <Tab value={TabOption.issueNotes} label='Issue Notes' />
          </Tabs>
        </Box>
        <Grid
          justify='center'
          container
          direction={'column'}
          alignItems={'stretch'}
          spacing={1}
        >
          {notes.map((note) => {
            return (
              <NotePaper
                key={note.meta.id}
                noteData={note}
                mergeRequest={mergeRequest.data}
                issue={issue.data}
                isMergeRequestNote={isMergeRequestNote}
              />
            );
          })}
        </Grid>
      </Container>
    </>
  );
};

export default Comment;
