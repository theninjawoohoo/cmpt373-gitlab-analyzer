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
import { useGetMergeRequestNotes } from '../../api/note';
// import { useParams } from 'react-router-dom';
import NotePaper from './NotePaper';
import { useGetMergeRequestById } from '../../api/mergeRequests';
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

const Comment: React.FC = () => {
  const classes = useStyles();

  const merge_request_id = '6cc45a67-e562-4014-982c-8973a36d5743';
  const mergeRequest = useGetMergeRequestById(merge_request_id);
  console.log(mergeRequest.data);
  const issue_id = '3d9719cf-c951-4e26-a4ad-9126659a1331';
  console.log(merge_request_id);
  console.log(issue_id);
  // const { startDate, endDate, emails } = useFilterContext();
  const { data: notes } = useGetMergeRequestNotes(merge_request_id);
  console.log(notes?.results || []);

  const [noteType, setNoteType] = useState(0);
  // const [noteData /*setNoteData*/] = useState<ApiResource<Note>[]>(
  //   notes?.results || [],
  // );

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     let date = DateTime.fromISO(startDate);
  //     const filteredData = [];
  //     if (noteType == 0) {
  //       do {
  //         filteredData.push(
  //           getMergeRequestNoteData(date, mergeRequestNotes?.results || []),
  //         );
  //         date = date.plus({ days: 1 });
  //       } while (date <= DateTime.fromISO(endDate));
  //     } else {
  //       do {
  //         filteredData.push(getIssueNoteData(date, issueNotes?.results || []));
  //         date = date.plus({ days: 1 });
  //       } while (date <= DateTime.fromISO(endDate));
  //     }
  //     setNoteData(filteredData);
  //   }
  // }, [
  //   noteType,
  //   mergeRequestNotes?.results,
  //   issueNotes?.results,
  //   startDate,
  //   endDate,
  // ]);

  const handleTabs = (event: React.ChangeEvent<unknown>, newType: number) => {
    setNoteType(newType);
  };

  return (
    <>
      <Container>
        <DefaultPageTitleFormat>Comments</DefaultPageTitleFormat>
        <Box my={2} className={classes.root}>
          <Tabs
            value={noteType}
            onChange={handleTabs}
            indicatorColor='primary'
            textColor='primary'
            centered
          >
            <Tab label='Code Reviews' />
            <Tab label='Issue Notes' />
          </Tabs>
        </Box>
        <Grid
          justify='center'
          container
          direction={'column'}
          alignItems={'stretch'}
          spacing={1}
        >
          {notes?.results?.map((note) => {
            return (
              <NotePaper
                key={note.meta.id}
                noteType={noteType}
                noteData={note}
                mergeRequest={mergeRequest.data}
              />
            );
          })}
        </Grid>
      </Container>
    </>
  );
};

export default Comment;
