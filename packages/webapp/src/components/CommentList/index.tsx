import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useGetNotesByRepository } from '../../api/note';
import NotePaper from './NotePaper';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
// import { useFilterContext } from '../../contexts/FilterContext';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    active_code_review_tab: {
      backgroundColor: '#b8d8be',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      fontWeight: 'bold',
    },
    inactive_code_review_tab: {
      backgroundColor: '#e8f4ea',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      fontWeight: 'bold',
    },
    active_issue_note_tab: {
      backgroundColor: '#d0c9ea',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      fontWeight: 'bold',
    },
    inactive_issue_note_tab: {
      backgroundColor: '#f3eef8',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      fontWeight: 'bold',
    },
  }),
);

enum TabOption {
  codeReview = 'code reviews',
  issueNotes = 'issue notes',
}

const CommentList: React.FC = () => {
  const classes = useStyles();

  // const { startDate, endDate /*emails*/ } = useFilterContext();
  const { repositoryId } = useRepositoryContext();
  const { data: allNotes } = useGetNotesByRepository(repositoryId);
  const mergeRequestNotes = allNotes?.results.filter(
    (comment) => comment.noteable_type == 'MergeRequest',
  );
  const issueNotes = allNotes?.results.filter(
    (comment) => comment.noteable_type == 'Issue',
  );

  const [tab, setTab] = useState(TabOption.codeReview);
  const isMergeRequestNote = tab === TabOption.codeReview;
  const notes =
    tab === TabOption.codeReview ? mergeRequestNotes || [] : issueNotes || [];

  const handleTabs = (event: React.ChangeEvent<unknown>, newTab: any) => {
    setTab(newTab);
  };

  return (
    <>
      <Container>
        <DefaultPageTitleFormat>Comments</DefaultPageTitleFormat>
        <Box my={2} className={classes.root}>
          <Tabs value={tab} onChange={handleTabs} textColor='primary' centered>
            <Tab
              value={TabOption.codeReview}
              label='Code Reviews'
              className={
                tab === TabOption.codeReview
                  ? classes.active_code_review_tab
                  : classes.inactive_code_review_tab
              }
            />
            <Tab
              value={TabOption.issueNotes}
              label='Issue Notes'
              className={
                tab === TabOption.issueNotes
                  ? classes.active_issue_note_tab
                  : classes.inactive_issue_note_tab
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
          {notes?.map((note) => {
            return (
              <NotePaper
                key={note.meta.id}
                noteData={note}
                isMergeRequestNote={isMergeRequestNote}
              />
            );
          })}
        </Grid>
      </Container>
    </>
  );
};

export default CommentList;
