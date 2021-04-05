import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Paper } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ApiResource } from '../../../api/base';
import { Note } from '@ceres/types';

interface NoteProps {
  noteType: number;
  noteData: ApiResource<Note>;
}

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      width: '100%',
      marginLeft: 5,
      marginTop: 5,
      marginBottom: 5,
      padding: 15,
    },
  }),
);

// const getMergeRequestNoteData = (date: DateTime, mergeRequestNotes: any[]) => {
//   let filteredMergeRequestNotes: any[];
//
//   for (const result of mergeRequestNotes) {
//     if (DateTime.fromISO(result.created_at).hasSame(date, 'day')) {
//       filteredMergeRequestNotes.push(result);
//     }
//   }
//
//   return {
//     date: date.toLocaleString(DateTime.DATE_SHORT),
//     filteredMergeRequestNotes,
//   };
// };
//
// const getIssueNoteData = (date: DateTime, issueNotes: any[]) => {
//   let filteredIssueNotes: any[];
//
//   for (const result of issueNotes) {
//     if (DateTime.fromISO(result.date).hasSame(date, 'day')) {
//       filteredIssueNotes.push(result);
//     }
//   }
//   return {
//     date: date.toLocaleString(DateTime.DATE_SHORT),
//     filteredIssueNotes,
//   };
// };

const NotePaper: React.FC<NoteProps> = (NoteProps) => {
  const classes = useStyles();

  // const { startDate, endDate, emails } = useFilterContext();
  // const { data: mergeRequestNotes } = useGetNotes(
  //   {
  //     author_email: emails,
  //     start_date: startDate,
  //     end_date: endDate,
  //   },
  //   0,
  //   9000,
  // );
  //
  //
  // useEffect(() => {
  //   if (startDate && endDate) {
  //     let date = DateTime.fromISO(startDate);
  //     const countsByDay = [];
  //     if (NoteProps.noteType == 0) {
  //       do {
  //         countsByDay.push(
  //           getMergeRequestNoteData(date, mergeRequestNotes?.results || []),
  //         );
  //         date = date.plus({ days: 1 });
  //       } while (date <= DateTime.fromISO(endDate));
  //     } else {
  //       do {
  //         countsByDay.push(getIssueNoteData(date, issueNotes?.results || []));
  //         date = date.plus({ days: 1 });
  //       } while (date <= DateTime.fromISO(endDate));
  //     }
  //     setNoteData(countsByDay);
  //   }
  // }, [
  //   NoteProps.noteType,
  //   mergeRequestNotes?.results,
  //   issueNotes?.results,
  //   startDate,
  //   endDate,
  // ]);

  if (NoteProps.noteType == 0) {
    return (
      <Paper
        elevation={3}
        className={classes.paper}
        key={NoteProps.noteData.id}
      >
        <Grid id='header-row' justify={'space-between'} alignItems={'center'}>
          <Typography>
            <Box fontSize={18} paddingBottom={1.5}>
              On merge request{' '}
              <Box fontWeight='fontWeightBold' display='inline'>
                {NoteProps.noteData.id}
              </Box>
            </Box>
          </Typography>
        </Grid>
        <Grid
          id='content-row'
          alignItems={'flex-start'}
          container
          direction={'row'}
          spacing={2}
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
                {NoteProps.noteData.author}
              </Box>{' '}
              wrote:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{NoteProps.noteData.body}</Typography>
            <Typography variant={'body2'} align={'right'}>
              <Box fontSize={16} fontStyle={'italic'} marginTop={2}>
                {NoteProps.noteData.created_at}
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography align={'right'}>
              <Box fontWeight={'fontWeightBold'} fontSize={20} marginRight={2}>
                Word Count
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  } else {
    return (
      <Paper elevation={3} className={classes.paper}>
        <Grid id='header-row' justify={'space-between'} alignItems={'center'}>
          <Typography>
            <Box fontSize={18} paddingBottom={1.5}>
              On issue{' '}
              <Box fontWeight='fontWeightBold' display='inline'>
                Link-to-issue
              </Box>
            </Box>
          </Typography>
        </Grid>
        <Grid
          id='content-row'
          alignItems={'flex-start'}
          container
          direction={'row'}
          spacing={2}
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
                Author X
              </Box>{' '}
              wrote:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>
              This should display the content body of a note left on an issue.
            </Typography>
            <Typography variant={'body2'} align={'right'}>
              <Box fontSize={16} fontStyle={'italic'} marginTop={2}>
                Date and time of the note issue
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography align={'right'}>
              <Box fontWeight={'fontWeightBold'} fontSize={20} marginRight={2}>
                Word Count
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  }
};

export default NotePaper;
