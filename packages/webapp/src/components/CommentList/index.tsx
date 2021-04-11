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
import { useFilterContext } from '../../contexts/FilterContext';
import { ApiResource } from '../../api/base';
import { RepositoryMember } from '@ceres/types';
import { useRepositoryMembers } from '../../api/repo_members';
import DifferentiatingIcon from './DifferentiatingIcon';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      color: '#25476d',
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

function findRepoMemberId(
  filtered_id: string,
  members: ApiResource<RepositoryMember>[],
) {
  const filtered = (members || []).filter(
    (member) => member.meta.id === filtered_id,
  );

  return filtered.map((member) => member.id);
}

const CommentList: React.FC = () => {
  const classes = useStyles();

  const { startDate, endDate, author } = useFilterContext();
  const { repositoryId } = useRepositoryContext();
  const { data: members } = useRepositoryMembers(repositoryId);
  const authorIds = findRepoMemberId(author, members);
  const { data: allNotes } = useGetNotesByRepository(
    {
      repository_id: repositoryId,
      created_start_date: startDate,
      created_end_date: endDate,
      author_id: authorIds,
    },
    0,
    9000,
  );

  const mergeRequestNotes = allNotes?.results.filter(
    (comment) => comment.noteable_type == 'MergeRequest',
  );

  const issueNotes = allNotes?.results.filter(
    (comment) => comment.noteable_type == 'Issue',
  );

  const [tab, setTab] = useState(TabOption.codeReview);
  const notes =
    tab === TabOption.codeReview ? mergeRequestNotes || [] : issueNotes || [];

  const handleTabs = (event: React.ChangeEvent<unknown>, newTab: any) => {
    setTab(newTab);
  };

  return (
    <>
      <Container>
        <DefaultPageTitleFormat>Comments</DefaultPageTitleFormat>
        <Box my={1} className={classes.root}>
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
          <Grid
            container
            direction={'row'}
            alignItems={'center'}
            style={{ marginTop: 15 }}
          >
            {tab === TabOption.codeReview ? (
              <>
                <Grid
                  container
                  item
                  xs={6}
                  alignItems={'center'}
                  direction={'row'}
                >
                  <DifferentiatingIcon isMine={true} />
                  <Typography style={{ marginLeft: 10, marginRight: 10 }}>
                    Notes on my own merge request(s)
                  </Typography>
                </Grid>
                <Grid
                  container
                  item
                  xs={6}
                  alignItems={'center'}
                  direction={'row'}
                >
                  <DifferentiatingIcon isMine={false} />
                  <Typography style={{ marginLeft: 10, marginRight: 10 }}>
                    Notes on other members&apos; merge request(s)
                  </Typography>
                </Grid>
              </>
            ) : (
              <>
                <Grid
                  container
                  item
                  xs={6}
                  alignItems={'center'}
                  direction={'row'}
                >
                  <DifferentiatingIcon isMine={true} />
                  <Typography style={{ marginLeft: 10, marginRight: 10 }}>
                    Notes on my own issue(s)
                  </Typography>
                </Grid>
                <Grid
                  container
                  item
                  xs={6}
                  alignItems={'center'}
                  direction={'row'}
                >
                  <DifferentiatingIcon isMine={false} />
                  <Typography style={{ marginLeft: 10, marginRight: 10 }}>
                    Notes on other members&apos; issue(s)
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
        <Grid
          justify={'center'}
          container
          direction={'column'}
          alignItems={'stretch'}
          spacing={1}
        >
          {notes?.map((note) => {
            return <NotePaper key={note.meta.id} noteData={note} />;
          })}
        </Grid>
      </Container>
    </>
  );
};

export default CommentList;
