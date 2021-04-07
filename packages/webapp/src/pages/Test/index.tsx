import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { createStyles, makeStyles } from '@material-ui/core/styles';
// import { DateTime } from 'luxon';
// import { useFilterContext } from '../../contexts/FilterContext';
import { useGetIssueNotes, useGetMergeRequestNotes } from '../../api/note';
// import { useParams } from 'react-router-dom';
import NotePaper from './NotePaper';
import { useGetMergeRequestById } from '../../api/mergeRequests';
import { useGetIssueById } from '../../api/issue';
// import { ApiResource } from '../../api/base';
// import { Note } from '@ceres/types';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    active_code_review_tab: {
      backgroundColor: '#b8d8be',
      borderRadius: 10,
      fontWeight: 'bold',
    },
    active_issue_note_tab: {
      backgroundColor: '#d0c9ea',
      borderRadius: 10,
      fontWeight: 'bold',
    },
  }),
);

enum TabOption {
  codeReview = 'code reviews',
  issueNotes = 'issue notes',
}

const Comment: React.FC = () => {
  const classes = useStyles();

  const merge_request_id = '047a9f94-a2a3-4e60-aa87-a4187562b3b0';
  const mergeRequest = useGetMergeRequestById(merge_request_id);
  const { data: mergeRequestNotes } = useGetMergeRequestNotes(merge_request_id);

  const issue_id = '61d75c79-8afc-4e59-9b3b-fa994727ea66';
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
            // indicatorColor='primary'
            textColor='primary'
            centered
          >
            <Tab
              value={TabOption.codeReview}
              label='Code Reviews'
              className={
                tab === TabOption.codeReview
                  ? classes.active_code_review_tab
                  : classes.root
              }
            />
            <Tab
              value={TabOption.issueNotes}
              label='Issue Notes'
              className={
                tab === TabOption.issueNotes
                  ? classes.active_issue_note_tab
                  : classes.root
              }
            />
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
