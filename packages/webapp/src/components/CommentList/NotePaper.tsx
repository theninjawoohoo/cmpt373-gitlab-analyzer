import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Paper } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ApiResource } from '../../api/base';
import { /*Issue,*/ /*MergeRequest*/ Note } from '@ceres/types';
import SmartDate from '../SmartDate';
import { useGetMergeRequestByNoteId } from '../../api/mergeRequests';
import { useGetIssueByNoteId } from '../../api/issue';
import { useRepositoryContext } from '../../contexts/RepositoryContext';

interface NoteProps {
  noteData: ApiResource<Note>;
  isMergeRequestNote?: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      width: '100%',
      marginLeft: 5,
      marginTop: 5,
      marginBottom: 5,
      fontColor: 'primary',
    },
    merge_request_note_header_row: {
      backgroundColor: '#e8f4ea',
      padding: 10,
    },
    issue_note_header_row: {
      backgroundColor: '#f3eef8',
      padding: 10,
    },
  }),
);

const extractNoteContent = (noteBody: string) => {
  return noteBody.replace(/\*([^*]+)\*$/g, '').trim();
};

// const onMyOwnMergeRequest = (
//   noteAuthorId: number,
//   mergeRequest: ApiResource<MergeRequest>,
// ) => {
//   return noteAuthorId === mergeRequest?.author.id;
// };

// const onMyOwnIssue = (noteAuthorId: number, issue: ApiResource<Issue>) => {
//   return noteAuthorId === issue.author.id;
// };

const NotePaper: React.FC<NoteProps> = (NoteProps) => {
  const { repositoryId } = useRepositoryContext();
  const classes = useStyles();

  const { data: mergeRequest } = useGetMergeRequestByNoteId({
    repository: repositoryId,
    note_id: NoteProps.noteData.meta.id,
  });
  if (mergeRequest) {
    console.log(mergeRequest?.results.find((element) => element));
  }
  const { data: issue } = useGetIssueByNoteId({
    repository: repositoryId,
    note_id: NoteProps.noteData.meta.id,
  });

  const shouldDisplayMergeRequestNote =
    NoteProps.noteData.noteable_type === 'MergeRequest';

  return (
    <Paper elevation={3} className={classes.paper} key={NoteProps.noteData.id}>
      <Grid
        id='header-row'
        justify={'space-between'}
        alignItems={'center'}
        className={
          shouldDisplayMergeRequestNote
            ? classes.merge_request_note_header_row
            : classes.issue_note_header_row
        }
      >
        {shouldDisplayMergeRequestNote && (
          <>
            <Typography>
              <Box fontSize={18}>
                On merge request{' '}
                <Box fontWeight='fontWeightBold' display='inline'>
                  {mergeRequest?.results.find((element) => element).title}
                </Box>
              </Box>
            </Typography>

            <Typography>
              <Box>
                {NoteProps.noteData.author.id ===
                mergeRequest?.results.find((element) => element).author.id
                  ? 'My MR'
                  : "Other's MR"}
              </Box>
            </Typography>
          </>
        )}
        {!shouldDisplayMergeRequestNote && (
          <>
            <Typography>
              <Box fontSize={18}>
                On issue{' '}
                <Box fontWeight='fontWeightBold' display='inline'>
                  {issue?.results.find((element) => element).title}
                </Box>
              </Box>
            </Typography>
            <Typography>
              <Box>
                {NoteProps.noteData.author.id ===
                issue?.results.find((element) => element).author.id
                  ? 'My Issue'
                  : "Other's Issue"}
              </Box>
            </Typography>
          </>
        )}
      </Grid>
      <Grid
        id='content-row'
        alignItems={'flex-start'}
        container
        direction={'row'}
        spacing={2}
        style={{
          padding: 10,
        }}
      >
        <Grid
          item
          xs={2}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Typography>
            <Box fontWeight='fontWeightBold' display='inline'>
              {NoteProps.noteData.author.name}
            </Box>{' '}
            wrote:
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{extractNoteContent(NoteProps.noteData.body)}</Typography>
          <Typography variant={'body2'} align={'right'}>
            <Box fontSize={16} fontStyle={'italic'} marginTop={2}>
              <SmartDate>{NoteProps.noteData.created_at}</SmartDate>
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography align={'right'}>
            <Box fontWeight={'fontWeightBold'} fontSize={20} marginRight={2}>
              {NoteProps.noteData.extensions?.wordCount} words
            </Box>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NotePaper;
