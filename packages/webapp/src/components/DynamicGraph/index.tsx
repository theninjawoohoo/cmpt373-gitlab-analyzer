import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useCommitDailyCounts } from '../../api/commit';
import { DateTime } from 'luxon';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import MemberDropdown from '../CommitList/components/MemberDropdown';
import { useDateFilterContext } from '../../contexts/DateFilterContext';
import CalendarFilter from '../CalendarFilter';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2rem',
      display: 'flex',
      width: '100vw',
      alignContent: 'flex-start',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    },
    tabs: {
      padding: '2rem',
      width: '80vw', //TODO: fix tab bar layout
    },
  }),
);

const createGraphData = (date: DateTime, commits: any[], merges: any[]) => {
  let commitCount = 0;
  let mergeCount = 0;
  for (const result of commits) {
    if (DateTime.fromISO(result.date).hasSame(date, 'day')) {
      commitCount += result.count;
    }
  }
  for (const result of merges) {
    if (DateTime.fromISO(result.date).hasSame(date, 'day')) {
      mergeCount += result.count;
    }
  }
  return {
    date: date.toLocaleString(DateTime.DATE_SHORT),
    commitCount,
    mergeCount,
  };
};

const DynamicGraph: React.FC = () => {
  const classes = useStyles();
  const { startDate, endDate } = useDateFilterContext();
  const [value, setValue] = React.useState(0);
  const { id } = useParams<{ id: string }>();
  // const { data: repoMembers } = useRepositoryMembers(id);
  const [emails, setEmails] = useState<string[]>([]);
  const { data: commits } = useCommitDailyCounts(
    {
      repository: id,
      author_email: emails,
    },
    0,
    9000,
  );
  const [mergeResults] = useState([]); // Empty until backend implements call
  const [graphData, setGraphData] = useState([]);

  // useEffect(() => {
  //   if (studentName != 'All students') {
  //     setCommitResults(
  //       commits?.results.filter((commit) => commit.author_name == studentName),
  //     );
  //     setMergeResults([]); // Empty until backend implements call
  //   } else {
  //     setCommitResults(commits?.results);
  //     setMergeResults([]);
  //   }
  // }, [emails]);

  useEffect(() => {
    if (mergeResults && startDate && endDate) {
      let date = DateTime.fromISO(startDate);
      const countsByDay = [];
      do {
        countsByDay.push(
          createGraphData(date, commits?.results || [], mergeResults),
        );
        date = date.plus({ days: 1 });
      } while (date <= DateTime.fromISO(endDate));
      setGraphData(countsByDay);
    }
  }, [commits?.results, startDate, endDate]);

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: number,
  ) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid container direction='column' spacing={2} className={classes.root}>
        <Grid item>
          <DefaultPageTitleFormat>Contribution Graph</DefaultPageTitleFormat>
        </Grid>
        <Grid item>
          <CalendarFilter startDateIso={startDate} endDateIso={endDate} />
        </Grid>
        <Grid
          item
          container
          direction='row'
          justify='space-between'
          className={classes.tabs}
        >
          <Grid item>
            <Tabs
              value={value}
              onChange={handleChange}
              variant='fullWidth'
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab label='Codes' />
              <Tab label='Scores' />
              <Tab label='Comments' />
            </Tabs>
          </Grid>
          <Grid item>
            <MemberDropdown
              repositoryId={id}
              onChange={(newEmails) => {
                setEmails(newEmails);
              }}
            />
          </Grid>
        </Grid>
        <Grid item>
          <BarChart width={1000} height={500} data={graphData}>
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend layout='vertical' align='right' verticalAlign='top' />
            <Bar
              dataKey='commitCount'
              name='Commits'
              stackId='a'
              fill='#0A4D63'
            />
            <Bar
              dataKey='mergeCount'
              name='Merge Requests'
              stackId='a'
              fill='#e37500'
            />
          </BarChart>
        </Grid>
      </Grid>
    </>
  );
};

export default DynamicGraph;
